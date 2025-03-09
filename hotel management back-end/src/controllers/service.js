import { executeQuery, closeSQLConnection } from "../config/db";
import Service from "../models/service";
import { serviceSchema } from "./../schemas/service";

export const getService = async (req, res) => {
  try {
    const serviceTypes = await executeQuery("SELECT * FROM Service");
    if (serviceTypes.length === 0) {
      res.status(404).send("No service types found");
    } else {
      res.send(serviceTypes);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  } finally {
    await closeSQLConnection();
  }
};

export const getServiceById = async (req, res) => {
    try {
    const { id } = req.params;
    const serviceType = await executeQuery(
      "SELECT * FROM Service WHERE id = ?",
      [id]
    );
    if (serviceType.length === 0) {
      res.status(404).send("Service type not found");
    } else {
      res.send(serviceType[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createService = async (req, res) => {
    try {
    const service = new Service(req.body);
    const { error } = serviceSchema.validate(service, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    const result = await executeQuery(
      "INSERT INTO Service (ServiceName, ServiceTypeId, Price, Description) VALUES (?, ?, ?, ?)",
      [service.ServiceName, service.ServiceTypeId, service.Price, service.Description]
    );
    res.status(201).send({ message: "Service created successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateService = async (req, res) => {
    try {
    const { id } = req.params;
    const serviceType = new ServiceType(req.body);
    const { error } = serviceTypeSchema.validate(serviceType, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    const result = await executeQuery(
      "UPDATE Service SET name = ?, description = ? WHERE id = ?",
      [serviceType.name, serviceType.description, id]
    );
    res.status(200).send({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteService = async (req, res) => {
    try {
    const { id } = req.params;
    const result = await executeQuery("DELETE FROM Service WHERE id = ?", [
      id,
    ]);
    res.status(200).send({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};