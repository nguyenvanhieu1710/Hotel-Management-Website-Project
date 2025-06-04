import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../demo/service/ProductService";
import { LayoutContext } from "../layout/context/layoutcontext";
import Link from "next/link";
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
    image:
      "https://htmediagroup.vn/wp-content/uploads/2023/03/Anh-profile-nam-14-min.jpg",
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
  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);

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
    </div>
  );
};

export default Dashboard;
