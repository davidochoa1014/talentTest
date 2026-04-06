const customerService = require('../services/customerService');

exports.getCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

exports.postCustomer = async (req, res) => {
    try {
        const id = await customerService.createCustomer(req.body);
        res.status(201).json({ id, message: "Cliente creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params; 
    const success = await customerService.updateCustomer(id, req.body);
    
    if (success) {
      res.json({ message: "Cliente actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error al editar cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};