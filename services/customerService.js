const db = require('../config/db');

const getAllCustomers = async () => {
    try {
        const [rows] = await db.promise().execute('SELECT * FROM customers');
            
        return rows;
    } catch (error) {
        console.error("Error en getAllCustomers:", error);
        throw error;
    }
};


const createCustomer = async (customerData) => {
    const { full_name, document_id, phone, address } = customerData;
    
    const query = `
        INSERT INTO customers (full_name, document_id, phone, address) 
        VALUES (?, ?, ?, ?)
    `;
    
    try {
        
        const [result] = await db.promise().execute(query, [
            full_name || null, 
            document_id || null, 
            phone || '', 
            address || ''
        ]);

        // return the created object
        return {
            id: result.insertId,
            ...customerData
        };
    } catch (error) {
        console.error("Error detallado en la base de datos:", error.message);
        throw error;
    }
};

const updateCustomer = async (id, customerData) => {
  const { full_name, email, phone, address } = customerData;
  
  
  const [result] = await db.promise().execute(
    'UPDATE customers SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [full_name, email, phone, address, id]
  );
  
  return result.affectedRows > 0;
};

module.exports = { getAllCustomers, createCustomer , updateCustomer};