import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../layout/context/layoutcontext";
import axios from "axios";

const lineData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "#2f4860",
      borderColor: "#2f4860",
      tension: 0.4,
    },
    {
      label: "Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

const mostBookedRoomsData = [
  {
    roomType: "Deluxe",
    bookingCount: 120,
    bookingRate: 60,
    backgroundColorClass: "bg-orange-500",
  },
  {
    roomType: "Superior",
    bookingCount: 90,
    bookingRate: 45,
    backgroundColorClass: "bg-cyan-500",
  },
  {
    roomType: "Standard",
    bookingCount: 75,
    bookingRate: 38,
    backgroundColorClass: "bg-pink-500",
  },
  {
    roomType: "Suite",
    bookingCount: 50,
    bookingRate: 25,
    backgroundColorClass: "bg-green-500",
  },
  {
    roomType: "Family",
    bookingCount: 40,
    bookingRate: 20,
    backgroundColorClass: "bg-purple-500",
  },
  {
    roomType: "Single",
    bookingCount: 30,
    bookingRate: 15,
    backgroundColorClass: "bg-teal-500",
  },
];

const recentBookings = [
  {
    customerName: "John Smith",
    roomType: "Deluxe",
    checkInDate: "2025-05-10",
    checkOutDate: "2025-05-15",
    status: "Confirmed",
    image: "https://faceinch.vn/upload/elfinder/NewFolder/WE29.jpg",
  },
  {
    customerName: "Jane Doe",
    roomType: "Standard",
    checkInDate: "2025-05-12",
    checkOutDate: "2025-05-14",
    status: "Pending Payment",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV_2WCrDRnGz7MePc7Y5mXhAkYP3sLA5Vc8g&s",
  },
  {
    customerName: "Peter Jones",
    roomType: "Suite",
    checkInDate: "2025-05-15",
    checkOutDate: "2025-05-20",
    status: "Cancelled",
    image: "https://static.tuoitre.vn/tto/i/s1280/2016/01/10/480e39d9.jpg",
  },
];

const weeklyBookingData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Bookings",
      data: [30, 45, 35, 50, 60, 80, 70],
      backgroundColor: "#42A5F5",
      borderColor: "#42A5F5",
      borderWidth: 1,
    },
  ],
};

const weeklyBookingOptions = {
  plugins: {
    legend: {
      labels: {
        color: "#495057",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#495057",
      },
      grid: {
        color: "#ebedef",
      },
    },
    y: {
      ticks: {
        color: "#495057",
      },
      grid: {
        color: "#ebedef",
      },
    },
  },
};

const Dashboard = () => {
  const [bookings, setBookings] = useState(recentBookings);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [reportFormat, setReportFormat] = useState(null);
  const toast = useRef(null);
  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);

  const reportTypes = [
    { label: "Revenue Report", value: "revenue" },
    { label: "Booking Report", value: "bookings" },
    { label: "Evaluation Report", value: "evaluations" },
    { label: "User Report", value: "users" },
  ];

  const reportFormats = [
    { label: "PDF", value: "pdf" },
    { label: "Excel", value: "excel" },
    { label: "CSV", value: "csv" },
  ];

  // Sample data for reports
  const generateSampleData = (type, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];

    // Generate data for each day in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split("T")[0];

      switch (type) {
        case "revenue":
          data.push({
            date,
            totalRevenue: Math.floor(Math.random() * 10000000),
            roomRevenue: Math.floor(Math.random() * 8000000),
            serviceRevenue: Math.floor(Math.random() * 2000000),
            numberOfBookings: Math.floor(Math.random() * 50),
          });
          break;
        case "bookings":
          data.push({
            date,
            totalBookings: Math.floor(Math.random() * 50),
            confirmedBookings: Math.floor(Math.random() * 40),
            cancelledBookings: Math.floor(Math.random() * 10),
            averageStayDuration: Math.floor(Math.random() * 5) + 1,
          });
          break;
        case "evaluations":
          data.push({
            date,
            totalEvaluations: Math.floor(Math.random() * 30),
            averageRating: (Math.random() * 2 + 3).toFixed(1),
            positiveReviews: Math.floor(Math.random() * 20),
            negativeReviews: Math.floor(Math.random() * 10),
          });
          break;
        case "users":
          data.push({
            date,
            newUsers: Math.floor(Math.random() * 20),
            activeUsers: Math.floor(Math.random() * 100),
            totalUsers: Math.floor(Math.random() * 1000),
            userGrowth: (Math.random() * 5).toFixed(1),
          });
          break;
      }
    }
    return data;
  };

  const formatValue = (value) => {
    if (typeof value === "number") {
      // Format numbers with commas for thousands
      return value.toLocaleString("en-US");
    }
    if (typeof value === "string") {
      // Add quotes around strings and escape existing quotes
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const generateCSV = (data, headers) => {
    // Calculate column widths
    const columnWidths = headers.map((header, index) => {
      const maxDataLength = Math.max(
        header.length,
        ...data.map((row) => String(Object.values(row)[index]).length)
      );
      return Math.max(maxDataLength, 10); // Minimum width of 10
    });

    // Format headers with padding
    const formattedHeaders = headers.map((header, index) => {
      return header.padEnd(columnWidths[index]);
    });

    // Format data rows with padding
    const formattedRows = data.map((row) => {
      return Object.values(row).map((value, index) => {
        const formattedValue = formatValue(value);
        return String(formattedValue).padEnd(columnWidths[index]);
      });
    });

    // Join with tabs for better spacing
    const csvContent = [
      formattedHeaders.join("\t"),
      ...formattedRows.map((row) => row.join("\t")),
    ].join("\n");

    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  };

  const generateExcel = (data, headers) => {
    // For demo purposes, we'll just return CSV as Excel
    // In a real implementation, you would use a library like xlsx
    return generateCSV(data, headers);
  };

  const generatePDF = (data, headers, title) => {
    // For demo purposes, we'll just return CSV as PDF
    // In a real implementation, you would use a library like jsPDF
    return generateCSV(data, headers);
  };

  const generateRevenueReport = async (startDate, endDate, format) => {
    try {
      const data = generateSampleData("revenue", startDate, endDate);
      const headers = [
        "Date",
        "Total Revenue",
        "Room Revenue",
        "Service Revenue",
        "Number of Bookings",
      ];

      let blob;
      switch (format) {
        case "csv":
          blob = generateCSV(data, headers);
          break;
        case "xlsx":
          blob = generateExcel(data, headers);
          break;
        case "pdf":
          blob = generatePDF(data, headers, "Revenue Report");
          break;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `revenue-report-${startDate}-to-${endDate}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating revenue report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate revenue report",
        life: 3000,
      });
    }
  };

  const generateBookingReport = async (startDate, endDate, format) => {
    try {
      const data = generateSampleData("bookings", startDate, endDate);
      const headers = [
        "Date",
        "Total Bookings",
        "Confirmed Bookings",
        "Cancelled Bookings",
        "Average Stay Duration",
      ];

      let blob;
      switch (format) {
        case "csv":
          blob = generateCSV(data, headers);
          break;
        case "xlsx":
          blob = generateExcel(data, headers);
          break;
        case "pdf":
          blob = generatePDF(data, headers, "Booking Report");
          break;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `booking-report-${startDate}-to-${endDate}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating booking report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate booking report",
        life: 3000,
      });
    }
  };

  const generateEvaluationReport = async (startDate, endDate, format) => {
    try {
      const data = generateSampleData("evaluations", startDate, endDate);
      const headers = [
        "Date",
        "Total Evaluations",
        "Average Rating",
        "Positive Reviews",
        "Negative Reviews",
      ];

      let blob;
      switch (format) {
        case "csv":
          blob = generateCSV(data, headers);
          break;
        case "xlsx":
          blob = generateExcel(data, headers);
          break;
        case "pdf":
          blob = generatePDF(data, headers, "Evaluation Report");
          break;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `evaluation-report-${startDate}-to-${endDate}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating evaluation report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate evaluation report",
        life: 3000,
      });
    }
  };

  const generateUserReport = async (startDate, endDate, format) => {
    try {
      const data = generateSampleData("users", startDate, endDate);
      const headers = [
        "Date",
        "New Users",
        "Active Users",
        "Total Users",
        "User Growth (%)",
      ];

      let blob;
      switch (format) {
        case "csv":
          blob = generateCSV(data, headers);
          break;
        case "xlsx":
          blob = generateExcel(data, headers);
          break;
        case "pdf":
          blob = generatePDF(data, headers, "User Report");
          break;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `user-report-${startDate}-to-${endDate}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating user report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate user report",
        life: 3000,
      });
    }
  };

  const generateReport = async () => {
    if (!reportType || !dateRange || !reportFormat) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all report information",
        life: 3000,
      });
      return;
    }

    const startDate = dateRange[0]
      ? dateRange[0].toISOString().split("T")[0]
      : null;
    const endDate = dateRange[1]
      ? dateRange[1].toISOString().split("T")[0]
      : null;

    if (!startDate || !endDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select both start and end dates",
        life: 3000,
      });
      return;
    }

    toast.current.show({
      severity: "info",
      summary: "Processing",
      detail: "Generating report...",
      life: 3000,
    });

    try {
      switch (reportType) {
        case "revenue":
          await generateRevenueReport(startDate, endDate, reportFormat);
          break;
        case "bookings":
          await generateBookingReport(startDate, endDate, reportFormat);
          break;
        case "evaluations":
          await generateEvaluationReport(startDate, endDate, reportFormat);
          break;
        case "users":
          await generateUserReport(startDate, endDate, reportFormat);
          break;
        default:
          throw new Error("Invalid report type");
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Report generated successfully",
        life: 3000,
      });

      setReportDialogVisible(false);
      setDateRange(null);
      setReportType(null);
      setReportFormat(null);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate report",
        life: 3000,
      });
    }
  };

  const fetchBookings = () => {
    // axios
    //   .get("http://localhost:3000/api/booking-votes/get-all")
    //   .then((response) => {
    //     setBookings(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching bookings:", error);
    //   });
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/user/get-all")
      .then((response) => {
        // console.log("Users data:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const fetchEvaluations = () => {
    axios
      .get("http://localhost:3000/api/evaluation")
      .then((response) => {
        // console.log("Evaluations data:", response.data);
        setEvaluations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching evaluations:", error);
      });
  };

  const fetchBills = () => {
    axios
      .get("http://localhost:3000/api/bill")
      .then((response) => {
        // console.log("Bills data:", response.data);
        setBills(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bills:", error);
      });
  };

  useEffect(() => {
    fetchBookings();
    fetchBills();
    fetchUsers();
    fetchEvaluations();
  }, []);

  const calculateTotalRevenue = (bills) => {
    let total = 0;
    bills.forEach((bill) => {
      total += bill.TotalAmount;
    });
    return parseInt(total);
  };

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    if (layoutConfig.colorScheme === "light") {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      {/* Booking */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Booking</span>
              <div className="text-900 font-medium text-xl">
                {bookings.length}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-calendar-plus text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {bookings.length} new{" "}
          </span>
          <span className="text-500">compared to last month</span>
        </div>
      </div>
      {/* Revenue */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Revenue</span>
              <div className="text-900 font-medium text-xl">
                ${calculateTotalRevenue(bills)}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">since last week</span>
        </div>
      </div>
      {/* Customers */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Customers</span>
              <div className="text-900 font-medium text-xl">{users.length}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">520 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>
      {/* Comments */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Comments</span>
              <div className="text-900 font-medium text-xl">
                {evaluations.length} Unread
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      {/* Recent Booking */}
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Recent Booking</h5>
          <DataTable
            value={bookings}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header="Customer"
              body={(data) => (
                <img
                  className="shadow-2"
                  src={`${data.image}`}
                  alt={data.customerName}
                  width="50"
                  height="50"
                  style={{ objectFit: "cover" }}
                />
              )}
            />
            <Column
              field="customerName"
              header="Name"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="roomType"
              header="Room Type"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="checkInDate"
              header="Check-in Date"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="checkOutDate"
              header="Check-out Date"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="status"
              header="Status"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              header="Details"
              style={{ width: "10%" }}
              body={() => (
                <>
                  <Button icon="pi pi-info-circle" type="button" text />
                </>
              )}
            />
          </DataTable>
        </div>
        {/* Most booked rooms */}
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Most Booked Rooms</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu1.current.toggle(event)}
              />
              <Menu
                ref={menu1}
                popup
                model={[
                  { label: "Add New", icon: "pi pi-fw pi-plus" },
                  { label: "Remove", icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>
          <ul className="list-none p-0 m-0">
            {mostBookedRoomsData.map((room, index) => (
              <li
                key={index}
                className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
              >
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    {room.roomType}
                  </span>
                  <div className="mt-1 text-600">
                    Bookings: {room.bookingCount}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className={`h-full ${room.backgroundColorClass}`}
                      style={{ width: `${room.bookingRate}%` }}
                    />
                  </div>
                  <span
                    className={`${room.backgroundColorClass.replace(
                      "bg",
                      "text"
                    )} ml-3 font-medium`}
                  >
                    %{room.bookingRate}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        {/* Booking Overview */}
        <div className="card">
          <h5>Booking Overview</h5>
          <Chart type="line" data={lineData} options={lineOptions} />
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex align-items-center justify-content-between mb-4">
            <h5>Notifications</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu2.current.toggle(event)}
              />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: "Add New", icon: "pi pi-fw pi-plus" },
                  { label: "Remove", icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>

          <div>
            <span className="block text-600 font-medium mb-3">TODAY</span>
            <ul className="p-0 mx-0 mt-0 mb-4 list-none">
              <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-green-100">
                  <i className="pi pi-sign-in text-xl text-green-500" />
                </div>
                <span className="text-900 line-height-3">
                  New check-in: <span className="font-bold">John Smith</span> in{" "}
                  <span className="font-bold">Deluxe Room</span>.
                </span>
              </li>
              <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-blue-100">
                  <i className="pi pi-check-circle text-xl text-blue-500" />
                </div>
                <span className="text-900 line-height-3">
                  Booking confirmed for{" "}
                  <span className="font-bold">Jane Doe</span> from{" "}
                  <span className="font-bold">May 1st</span> to{" "}
                  <span className="font-bold">May 5th</span>.
                </span>
              </li>
              <li className="flex align-items-center py-2">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-orange-100">
                  <i className="pi pi-comment text-xl text-orange-500" />
                </div>
                <span className="text-900 line-height-3">
                  New review received: "
                  <span className="italic">Excellent service!</span>" from{" "}
                  <span className="font-bold">Peter Jones</span>.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <span className="block text-600 font-medium mb-3">YESTERDAY</span>
            <ul className="p-0 m-0 list-none">
              <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-red-100">
                  <i className="pi pi-exclamation-triangle text-xl text-red-500" />
                </div>
                <span className="text-900 line-height-3">
                  Reminder: Check-out for{" "}
                  <span className="font-bold">Linda Brown</span> today at{" "}
                  <span className="font-bold">12:00 PM</span>.
                </span>
              </li>
              <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-purple-100">
                  <i className="pi pi-user-plus text-xl text-purple-500" />
                </div>
                <span className="text-900 line-height-3">
                  New guest registered:{" "}
                  <span className="font-bold">Michael Clark</span>.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Weekly Booking Data</h5>
          <Chart
            type="bar"
            data={weeklyBookingData}
            options={weeklyBookingOptions}
          />
        </div>
      </div>

      {/* Report Section */}
      <div className="col-12">
        <div className="card">
          <h5>Export Report</h5>
          <div className="flex justify-content-start mb-4">
            <Button
              label="Create New Report"
              icon="pi pi-file-export"
              className="p-button-success"
              onClick={() => setReportDialogVisible(true)}
            />
          </div>
        </div>
      </div>

      <Dialog
        header="Export Report"
        visible={reportDialogVisible}
        style={{ width: "450px" }}
        onHide={() => {
          setReportDialogVisible(false);
          setDateRange(null);
          setReportType(null);
          setReportFormat(null);
        }}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => {
                setReportDialogVisible(false);
                setDateRange(null);
                setReportType(null);
                setReportFormat(null);
              }}
              className="p-button-text"
            />
            <Button
              label="Export Report"
              icon="pi pi-check"
              onClick={generateReport}
              autoFocus
            />
          </div>
        }
      >
        <div className="grid p-fluid">
          <div className="col-12 mb-4">
            <label htmlFor="reportType" className="block mb-2">
              Report Type
            </label>
            <Dropdown
              id="reportType"
              value={reportType}
              options={reportTypes}
              onChange={(e) => setReportType(e.value)}
              placeholder="Select report type"
              className="w-full"
            />
          </div>
          <div className="col-12 mb-4">
            <label htmlFor="dateRange" className="block mb-2">
              Date Range
            </label>
            <Calendar
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.value)}
              selectionMode="range"
              readOnlyInput
              className="w-full"
              showIcon
              dateFormat="dd/mm/yy"
            />
          </div>
          <div className="col-12 mb-4">
            <label htmlFor="reportFormat" className="block mb-2">
              Report Format
            </label>
            <Dropdown
              id="reportFormat"
              value={reportFormat}
              options={reportFormats}
              onChange={(e) => setReportFormat(e.value)}
              placeholder="Select format"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
