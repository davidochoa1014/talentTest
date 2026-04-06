const db = require('../config/db');

/**
 * Gets all loans with detailed information about books and customers
 */
const getAllLoans = async () => {
    try {
        const [rows] = await db.promise().execute(`
            SELECT 
                l.id, 
                b.title as book_title, 
                c.full_name as customer_name, 
                c.document_id as customer_doc,
                l.loan_date, 
                l.return_date, 
                l.rental_value
            FROM loans l
            INNER JOIN books b ON l.book_id = b.id
            INNER JOIN customers c ON l.customer_id = c.id
            ORDER BY l.loan_date DESC
        `);

        return rows;
    } catch (error) {
        console.error("Error in loanService.getAllLoans:", error.message);
        throw error;
    }
};

/**
 * Process a book returned
 */
const returnLoanTransaction = async (loanId, bookId) => {
    const connection = await db.promise().getConnection();
    
    try {
        await connection.beginTransaction();

        const [loanData] = await connection.execute(
            `SELECT l.loan_date, b.daily_price 
             FROM loans l 
             JOIN books b ON l.book_id = b.id 
             WHERE l.id = ?`, 
            [loanId]
        );

        if (loanData.length === 0) throw new Error("Loan not found");

        const { loan_date, daily_price } = loanData[0];
        const returnDateReal = new Date(); // today
        const startDate = new Date(loan_date);

        // min 1 daaay
        const diffTime = Math.ceil(Math.abs(returnDateReal - startDate) / (1000 * 60 * 60 * 24)) || 1;
        const newTotalValue = diffTime * parseFloat(daily_price);

        await connection.execute(
            `UPDATE loans 
             SET status = 0, 
                 return_date = ?, 
                 rental_value = ? 
             WHERE id = ?`, 
            [returnDateReal, newTotalValue, loanId]
        );

        
        await connection.execute(
            'UPDATE books SET available = 1 WHERE id = ?', 
            [bookId]
        );

        await connection.commit();
        return { 
            success: true, 
            days: diffTime, 
            finalValue: newTotalValue 
        };

    } catch (error) {
        await connection.rollback();
        console.error("Error recalculating loan:", error.message);
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Register a new loan and updates the book availability
 */
const registerLoanTransaction = async (loanData) => {
    const { book_id, customer_id, loan_date, return_date } = loanData;
   
    
    let connection;
    try {
        
        const promisePool = db.promise();
        connection = await promisePool.getConnection();
        
        await connection.beginTransaction();

        
        const [books] = await connection.execute('SELECT daily_price FROM books WHERE id = ?', [book_id]);
        
        if (books.length === 0) throw new Error("Book not found");
        
        const dailyPrice = parseFloat(books[0].daily_price);

        //  Calculate loan days
        const start = new Date(loan_date);
        const end = new Date(return_date);
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1; 
        const totalRentalValue = diffDays * dailyPrice;

        // Insert the loan
        await connection.execute(
            'INSERT INTO loans (book_id, customer_id, loan_date, return_date, rental_value) VALUES (?, ?, ?, ?, ?)',
            [book_id, customer_id, loan_date, return_date, totalRentalValue]
        );

        // Update book availability
        await connection.execute('UPDATE books SET available = 0 WHERE id = ?', [book_id]);

        await connection.commit();
        return { success: true, total: totalRentalValue };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error in loan transaction:", error); 
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const findActiveLoanByBook = async (bookId) => {
    console.log( 'SELECT id FROM loans WHERE book_id = ? AND status = 1 LIMIT 1///////',
        [bookId])
    const [rows] = await db.promise().execute(
        'SELECT id FROM loans WHERE book_id = ? AND status = 1 LIMIT 1',
        [bookId]
    );
    if (rows.length === 0) throw new Error("No active loan found");
    return rows[0];
};


module.exports = {
    getAllLoans,
    registerLoanTransaction,
    returnLoanTransaction,
    findActiveLoanByBook
};