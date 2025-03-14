import { executeMysqlQuery } from "../config/db";
import ServiceType from "../models/serviceType";
import { serviceTypeSchema } from "./../schemas/serviceType";

export const getAllServiceType = async (req, res) => {
  try {
    const serviceTypes = await executeMysqlQuery("SELECT * FROM ServiceType");
    if (serviceTypes.length === 0) {
      res.status(404).send("No service types found");
    } else {
      res.send(serviceTypes);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const getServiceTypeById = async (req, res) => {
  try {
    const serviceTypeId = req.params.id;
    const serviceType = await executeMysqlQuery(
      `SELECT * FROM ServiceType WHERE ServiceTypeID = ${serviceTypeId}`
    );
    if (serviceType.length === 0) {
      res.status(404).send("No service type found");
    } else {
      res.send(serviceType[0]);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const createServiceType = async (req, res) => {
  try {
    const serviceType = new ServiceType(req.body);
    const { error } = serviceTypeSchema.validate(serviceType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `INSERT INTO ServiceType (ServiceTypeName, Description, Deleted) VALUES (?, ?, ?)`,
      [
        serviceType.ServiceTypeName,
        serviceType.Description,
        serviceType.Deleted,
      ]
    );    
    res.status(200).json({ message: "Create service type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const updateServiceType = async (req, res) => {
  try {
    const serviceType = new ServiceType(req.body);
    const { error } = serviceTypeSchema.validate(serviceType, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await executeMysqlQuery(
      `UPDATE ServiceType 
       SET ServiceTypeName = ?, Description = ? 
       WHERE ServiceTypeID = ?`,
      [
        serviceType.ServiceTypeName,
        serviceType.Description,
        serviceType.ServiceTypeId,
      ]
    );    
    res.status(200).json({ message: "Update service type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};

export const deleteServiceType = async (req, res) => {
  try {
    const serviceTypeId = req.params.id;
    await executeMysqlQuery(
      `DELETE FROM ServiceType WHERE ServiceTypeID = ${serviceTypeId}`
    );
    res.status(200).json({ message: "Delete service type successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send(error.message);
  }
};
