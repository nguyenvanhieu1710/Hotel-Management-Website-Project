import { executeMysqlQuery } from "../config/db";
import Device from "../models/device";
import { deviceSchema } from "../schemas/device";

export const getAllDevices = async (req, res) => {
  try {
    const devices = await executeMysqlQuery("SELECT * FROM Device");
    if (devices.length === 0) {
      res.status(404).send("No devices found");
    } else {
      res.send(devices);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    const device = await executeMysqlQuery(
      `SELECT * FROM Device WHERE DeviceId = ${deviceId}`
    );
    if (device.length === 0) {
      res.status(404).send("Device not found");
    } else {
      res.send(device[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    const { error } = deviceSchema.validate(device, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    await executeMysqlQuery(
      `INSERT INTO Device (DeviceName, DeviceTypeId, RoomId, Price, Status, Description, Deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        device.DeviceName,
        device.DeviceTypeId,
        device.RoomId,
        device.Price,
        device.Status,
        device.Description,
        device.Deleted,
      ]
    );
    res.status(201).send({ message: "Device created successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    const { error } = deviceSchema.validate(device, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    await executeMysqlQuery(
      `UPDATE Device 
           SET DeviceName = ?,
               DeviceTypeId = ?,
               RoomId = ?,
               Price = ?,
               Status = ?,
               Description = ?,
               Deleted = ?
           WHERE DeviceId = ?`,
      [
        device.DeviceName,
        device.DeviceTypeId,
        device.RoomId,
        device.Price,
        device.Status,
        device.Description,
        device.Deleted,
        device.DeviceId,
      ]
    );
    res.send({ message: "Device updated successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    await executeMysqlQuery(
      `UPDATE Device SET Deleted = 1 WHERE DeviceId = ${deviceId}`
    );
    res.send({ message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: error.message });
  }
};
