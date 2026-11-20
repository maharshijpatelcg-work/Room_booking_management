# EquipBook — Campus Equipment & Resource Booking Management System

> A portfolio-level, full-stack campus equipment and facility management platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas** via **Mongoose**.

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Project Overview & Problem Statement

### The Problem
In academic institutions, universities, and colleges, high-value assets—such as laptops, digital cameras, laboratory equipment, projectors, and conference rooms—are frequently shared across multiple departments. Traditionally, institutions manage these loans through paper sign-out binders, disjointed email requests, or static spreadsheets. This leads to:
- **Scheduling Conflicts**: Simultaneous reservations of the same asset.
- **Inventory Discrepancies**: Missing or unaccounted units when partially returned.
- **Overdue Losses**: No automated tracking of due dates or overdue loans.
- **Lack of Condition Accountability**: Damaged equipment returned without logged inspection notes.
- **Zero Real-time Visibility**: Faculty and students cannot check availability before requesting items.

### The Solution: EquipBook
**EquipBook** provides an integrated, institutional management system featuring:
1. **Real-time Quantity-Based Availability**: Calculates active overlapping reservations over requested date/time intervals to prevent double-booking.
2. **End-to-End Approval Workflow**: Structured `Pending` → `Approved` → `Completed` states with issue quantity verification.
3. **Partial & Full Return Inspections**: Physical condition logging (`Excellent`, `Good`, `Damaged`, `Needs Maintenance`) with automatic stock restocking.
4. **Interactive Multi-View Calendar**: Visual timeline across Day, Week, and Month views.
5. **Audit Trail Timeline**: Immutable historical ledger with a 3-step visual progress bar (`Booked` → `Issued` → `Returned`).
6. **Comprehensive Analytics**: Aggregated utilization trends, category distributions, and overdue warnings.

---

## 2. Implemented Features

### 🏢 Resource & Inventory Management
- **Full CRUD Support**: Create, read, update, and soft-delete institutional assets.
- **Multi-Category Classification**: Laptops, Cameras, Projectors, Laboratory Equipment, Meeting Rooms, Sports Equipment, Audio Equipment, and Other.
- **Dynamic Stock Tracking**: Tracks `totalQuantity` and real-time `available` units.
- **Interactive Catalogue**: Toggle between responsive grid cards and a data table.
- **Search & Multi-Filters**: Instant search by asset name, location, or specs, filtered by category and availability.
- **Safety Safeguard**: Prevents deletion of resources that have active approved bookings.

### 📅 Booking & Reservation System
- **Conflict Prevention Engine**: Instant server-side overlap calculation preventing over-allocation.
- **Unique Booking References**: Auto-generated human-readable identifiers (e.g., `EQ-MWGS8PEK-YDSF`).
- **Administrative Lifecycle Controls**: Review, approve, reject, or cancel reservation requests.
- **Issue Tracking**: Records units physically handed over and tracks expected return dates.
- **Quick Export**: One-click CSV export of booking schedules.

### 📆 Multi-View Availability Calendar
- **Timeline Grid**: Multi-view schedule (Day, Week, and Month views).
- **Time Slot Resolution**: Hourly breakdown in Day view; daily schedule in Week/Month views.
- **Color-Coded Status Events**: Approved (Teal), Pending (Amber), Completed (Muted), and Rejected (Red).
- **Interactive Event Detail Modals**: Inspect custodian contact info, duration, and stated purpose directly from the calendar.

### 🔄 Returns & Inspection Management
- **Currently Issued Items**: Live tracking of outstanding equipment loans with overdue warning flags.
- **Partial & Full Returns**: Supports returning a fraction of issued units over time.
- **Hardware Condition Audits**: Quality ratings with custodian maintenance notes.
- **Automated Completion**: Automatically transitions bookings to `Completed` when all units are returned.

### 📜 Audit Trail & Ledger
- **Activity Timeline**: Full chronological ledger of campus reservations.
- **Visual Progress Bar**: 3-stage horizontal step timeline (`Booked` → `Issued` → `Returned · Date`).
- **KPI Summary Cards**: Total records, completed loans, units issued/returned ratio, and items needing attention.
- **Export Audit Ledger**: Downloadable CSV audit trail for departmental compliance.

### 📊 Institutional Analytics & Dashboard
- **6 Key Metrics**: Total Inventory, Available Units, Total Bookings, Pending Requests, Currently Issued, and Overdue Returns.
- **Visual Analytics with Recharts**:
  - Monthly Booking Demand (6-month volume bar chart).
  - Resource Category Distribution (donut chart).
- **Operational Feeds**: Recent bookings, most-booked assets, recently catalogued equipment, and pending review queue.

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 15.0.3 (App Router with Server & Client Components)
- **Language**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS 3.4.1 (Custom Institutional Design System)
- **Icons**: Lucide React
- **Data Visualization**: Recharts 2.13.3
- **Notifications**: Sonner (Toast alerts)
- **Typography**: Inter (Body & UI), JetBrains Mono (References & Dates)

### Backend
- **Architecture**: Decoupled sibling architecture (`backend/` separate from `src/`)
- **API Runtime**: Next.js API Route Handlers (`src/app/api/`)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **ODM**: Mongoose 8.8.2 (with connection caching)
- **Input Validation**: Zod 3.23.8

---

## 4. System Architecture & Folder Structure

```
next-assignment/
├── backend/                             # COMPLETE BACKEND BUSINESS LOGIC
│   ├── config/
│   │   └── db.ts                        # Mongoose global connection pool caching
│   ├── models/
│   │   ├── Resource.ts                  # Equipment catalogue schema
│   │   ├── Booking.ts                   # Reservation & loan schema
│   │   ├── Return.ts                    # Return inspection schema
│   │   └── UsageHistory.ts              # Immutable audit trail schema
│   ├── controllers/
│   │   ├── resourceController.ts        # Resource CRUD request handling
│   │   ├── bookingController.ts         # Booking lifecycle transitions
│   │   ├── returnController.ts          # Return & condition inspection handling
│   │   └── analyticsController.ts       # Metrics & chart aggregations
│   ├── services/
│   │   ├── availabilityService.ts       # Quantity overlap & conflict algorithm
│   │   ├── resourceService.ts           # Inventory management & stock updates
│   │   ├── bookingService.ts            # Approval, rejection & issuance logic
│   │   ├── returnService.ts             # Partial/full check-in & auto-completion
│   │   └── analyticsService.ts          # MongoDB aggregation pipelines
│   ├── validators/
│   │   ├── resourceValidator.ts         # Zod schemas for asset creation/updates
│   │   └── bookingValidator.ts          # Zod schemas for reservations
│   ├── utils/
│   │   ├── generateBookingReference.ts  # EQ-XXXXXX-XXXX reference generator
│   │   ├── dateHelpers.ts               # Overlap and timeline verification
│   │   └── apiResponse.ts               # Standardized JSON response envelope
│   └── types/
│       └── index.ts                     # Core TypeScript interfaces
│
├── src/                                 # FRONTEND (Next.js 15 App Router)
│   ├── app/
│   │   ├── layout.tsx                   # Global RootLayout (Inter & JetBrains Mono)
│   │   ├── globals.css                  # Tailwind styles & reference variables
│   │   ├── page.tsx                     # Redirect to /dashboard
│   │   ├── dashboard/page.tsx           # Institutional dashboard & charts
│   │   ├── resources/
│   │   │   ├── page.tsx                 # Inventory grid/table with filters
│   │   │   ├── [id]/page.tsx            # Resource specification & booking history
│   │   │   └── new/page.tsx             # New asset registration form
│   │   ├── bookings/
│   │   │   ├── page.tsx                 # Reservation ledger & issue requests
│   │   │   ├── calendar/page.tsx        # Interactive schedule timeline
│   │   │   └── new/page.tsx             # Booking application form
│   │   ├── returns/page.tsx             # Active loans & inspection logs
│   │   ├── history/page.tsx             # Reference Audit Trail timeline
│   │   └── api/                         # Next.js API Route Handlers
│   │       ├── resources/               # GET, POST, PUT, DELETE /api/resources
│   │       ├── bookings/                # GET, POST, PATCH /api/bookings
│   │       ├── availability/            # GET /api/availability
│   │       ├── returns/                 # GET, POST /api/returns
│   │       ├── analytics/               # GET /api/analytics
│   │       └── history/                 # GET /api/history
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx               # Horizontal top navigation bar
│   │   │   └── DashboardLayout.tsx      # TopNav container (no sidebar)
│   │   ├── common/                      # Button, Modal, Loader, EmptyState, ConfirmDialog
│   │   ├── dashboard/                   # StatsCard, BookingChart, RecentBookings
│   │   ├── resources/                   # ResourceCard, ResourceTable, ResourceFilters, ResourceForm
│   │   ├── bookings/                    # BookingTable, BookingCalendar, BookingForm, StatusBadge
│   │   └── returns/                     # ReturnForm
│   ├── hooks/                           # Custom React hooks (useResources, useBookings, useAnalytics)
│   ├── lib/api.ts                       # Typed client API wrapper & CSV exporter
│   └── utils/                           # Formatters, category badges & date helpers
├── scripts/
│   └── seed.js                          # Database seeder (20 realistic assets)
├── .env.example                         # Environment variable template
├── tailwind.config.ts                   # Tailwind configuration
└── tsconfig.json                        # TypeScript configuration
```

---

## 5. Database Models

### Resource Schema (`backend/models/Resource.ts`)
| Field | Type | Description |
|---|---|---|
| `name` | String | Unique resource name (e.g., "Dell XPS 15 Workstation") |
| `description` | String | Detailed hardware specifications and notes |
| `category` | Enum | 8 categories (`Laptops`, `Cameras`, `Projectors`, etc.) |
| `images` | String[] | Image URLs for catalogue preview |
| `location` | String | Physical room/lab (e.g., "Science Complex Rm 204") |
| `totalQuantity` | Number | Full campus inventory count |
| `available` | Number | Units currently available for reservation |
| `instructions` | String | Safety guidelines and operating procedures |
| `maintenanceNotes`| String | Service logs, calibration status |
| `isActive` | Boolean | Visibility flag (prevents breaking history) |

### Booking Schema (`backend/models/Booking.ts`)
| Field | Type | Description |
|---|---|---|
| `bookingReference`| String | Unique alphanumeric code (e.g., `EQ-MWGS8PEK-YDSF`) |
| `resource` | ObjectId | Reference to `Resource` |
| `requesterName` | String | Custodian / Faculty member name |
| `requesterEmail` | String | Institutional email address |
| `department` | String | Department or division |
| `purpose` | String | Academic course or project description |
| `startDate` | Date | Reservation start date |
| `endDate` | Date | Reservation end date |
| `startTime` | String | Start time (`HH:mm`) |
| `endTime` | String | End time (`HH:mm`) |
| `quantity` | Number | Requested item count |
| `status` | Enum | `Pending`, `Approved`, `Rejected`, `Cancelled`, `Completed` |
| `issuedQuantity` | Number | Units handed over upon approval |
| `returnedQuantity`| Number | Units inspected and returned |
| `expectedReturnDate`| Date | Scheduled return deadline |
| `actualReturnDate`| Date | Timestamp when fully returned |

### Return Schema (`backend/models/Return.ts`)
| Field | Type | Description |
|---|---|---|
| `booking` | ObjectId | Reference to `Booking` |
| `resource` | ObjectId | Reference to `Resource` |
| `returnedQuantity`| Number | Units returned in this check-in |
| `returnDate` | Date | Check-in timestamp |
| `condition` | Enum | `Excellent`, `Good`, `Damaged`, `Needs Maintenance` |
| `notes` | String | Inspector custody notes and defect report |

### UsageHistory Schema (`backend/models/UsageHistory.ts`)
| Field | Type | Description |
|---|---|---|
| `resource` | ObjectId | Reference to `Resource` |
| `booking` | ObjectId | Reference to `Booking` |
| `returnRecord` | ObjectId | Optional reference to `Return` |
| `action` | String | Logged event (e.g., `CREATED`, `APPROVED`, `RETURNED`) |
| `details` | String | Human-readable audit narrative |

---

## 6. API Endpoints

All endpoints return a standardized JSON structure: `{ success: boolean, data?: any, error?: string, message?: string }`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | Fetch all resources with optional `search`, `category`, `available` filters |
| `POST` | `/api/resources` | Create a new resource asset (validated with Zod) |
| `GET` | `/api/resources/[id]` | Fetch single resource by ID |
| `PUT` | `/api/resources/[id]` | Update resource details and inventory count |
| `DELETE` | `/api/resources/[id]` | Delete resource (safely blocked if active bookings exist) |
| `GET` | `/api/bookings` | Fetch bookings with optional `status`, `resource`, `search`, `date` filters |
| `POST` | `/api/bookings` | Create new booking request with conflict check |
| `GET` | `/api/bookings/[id]` | Fetch single booking by ID |
| `PATCH` | `/api/bookings/[id]` | Transition status (`Approve`, `Reject`, `Cancel`) and set `issuedQuantity` |
| `GET` | `/api/availability` | Check resource slot availability (`resourceId`, `startDate`, `endDate`, times) |
| `GET` | `/api/returns` | Fetch return inspection records |
| `POST` | `/api/returns` | Record a partial or full return, restock inventory, and update booking |
| `GET` | `/api/analytics` | Fetch metrics, category distributions, monthly trends, and queues |
| `GET` | `/api/history` | Fetch complete audit trail log |

---

## 7. Business Logic & Algorithms

### Resource Availability & Conflict Prevention
To prevent overbooking, the system verifies available inventory for any requested time window $[T_{\text{start}}, T_{\text{end}}]$ by querying all existing `Pending` or `Approved` bookings for the same asset where:

$$\text{Existing.startDate} < T_{\text{end}} \quad \text{AND} \quad \text{Existing.endDate} > T_{\text{start}}$$

The total reserved units across all overlapping bookings are summed:

$$\text{ReservedUnits} = \sum \text{Booking.quantity}$$

$$\text{AvailableUnits} = \max(0, \text{Resource.totalQuantity} - \text{ReservedUnits})$$

If $\text{RequestedQuantity} > \text{AvailableUnits}$, the request is rejected with a descriptive conflict response.

### Equipment Check-Out & Return Workflow
```
[Requester Submits Request]
            │
            ▼
   Status: PENDING
            │
            ▼ (Manager Reviews & Approves)
   Status: APPROVED
   - Manager confirms issuedQuantity
   - Sets expectedReturnDate
            │
            ▼ (Equipment In Custody)
   [Custodian Returns Asset]
   - Inspector records condition (Excellent / Good / Damaged / Needs Maintenance)
   - Stock automatically replenished: Resource.available += returnedQuantity
            │
            ▼
   Is returnedQuantity >= issuedQuantity?
       ├── YES ──► Status: COMPLETED (actualReturnDate logged)
       └── NO  ──► Status remains APPROVED (Partial return tracked)
```

---

## 8. Installation & Setup

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas**: An active MongoDB database connection URI

### 1. Clone the Repository
```bash
git clone https://github.com/kananiyashvi180-svg/Room-booking-management.git
cd Room-booking-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/equipment_booking?retryWrites=true&w=majority

# Next.js Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed the Database
Populate the database with 20 realistic campus resources across 7 categories:
```bash
node scripts/seed.js
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Production Build & Deployment

To verify TypeScript types and generate the optimized production build:

```bash
# Type-check without emitting files
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm run start
```

### Vercel Deployment
This application is fully compatible with [Vercel](https://vercel.com):
1. Import your GitHub repository into Vercel.
2. In the project settings, add the `MONGODB_URI` and `NEXT_PUBLIC_APP_URL` environment variables.
3. Deploy! Next.js App Router and API Route Handlers will run automatically as Serverless Functions.

---

## 10. Screenshots

| Section | Preview |
|---|---|
| **Top Navigation & Audit Trail** | *(Horizontal nav with logo, active teal pill, avatar YK, 4 KPI cards, search, and 3-step timeline)* |
| **Dashboard & Analytics** | *(6 metric cards, monthly booking trends bar chart, category donut chart, recent bookings)* |
| **Inventory Grid** | *(Resource cards with stock badges, preview images, location, and availability progress bar)* |
| **Multi-View Calendar** | *(Timeline schedule across Day, Week, and Month views with color-coded reservation events)* |
| **Returns & Inspection** | *(Outstanding loan ledger with overdue badges and check-in inspection dialog)* |

---

## 11. Future Enhancements

- [ ] **QR Code Scanning**: Print asset QR codes for instant mobile check-in and check-out.
- [ ] **Email & SMS Notifications**: Automated alerts for approved bookings and 24-hour return reminders.
- [ ] **Fine & Penalty Calculation**: Automatic late fee calculations for overdue equipment.
- [ ] **Multi-Campus Multi-Tenancy**: Support for university branches and departmental cost centers.
- [ ] **Role-Based Access Control (RBAC)**: Fine-grained permissions (Students, Lab Technicians, Faculty Admins).

---

## 12. Author & License

**Author:** Yashvi Kanani  
**Project:** EquipBook — Campus Equipment & Resource Booking Management System  
**Repository:** [https://github.com/kananiyashvi180-svg/Room-booking-management](https://github.com/kananiyashvi180-svg/Room-booking-management.git)  
**License:** This project is licensed under the [MIT License](LICENSE).
