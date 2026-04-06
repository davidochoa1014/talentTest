const loanService = require('../services/loanService');

exports.getLoans = async (req, res, next) => {
    try { 
        const loans = await loanService.getAllLoans();
        res.json(loans);
    } catch (error) {
       console.error("Error en loanController.getLoans:");
        console.error(error); 
        next(error); 
    }
};

exports.createLoan = async (req, res) => {
    try {
        await loanService.registerLoanTransaction(req.body);
        res.status(201).json({ message: "loand created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.returnLoan = async (req, res) => {
    const { id } = req.params; 
    const { bookId } = req.body; 

    try {
        const result = await loanService.returnLoanTransaction(id, bookId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveLoan = async (req, res) => {
    try {
        const { bookId } = req.params;
        const loan = await loanService.findActiveLoanByBook(bookId);
        res.status(200).json(loan);
    } catch (error) {
        res.status(error.message === "No active loan found" ? 404 : 500)
           .json({ error: error.message });
    }
};