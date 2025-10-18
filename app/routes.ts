import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	route("login", "routes/login.tsx"),
	route("/", "routes/__app.tsx", [
		index("routes/dashboard.tsx"),
		route("vehicles", "routes/vehicles.tsx"),
		route("vehicles/sold", "routes/vehicles.sold.tsx"),
		route("vehicles/add", "routes/vehicles.add.tsx"),
		route("vehicles/:id", "routes/vehicles.$id.tsx"),
		route("vehicles/:id/edit", "routes/vehicles.$id.edit.tsx"),
		route("makes", "routes/makes.tsx"),
		route("vehicle-types", "routes/vehicle-types.tsx"),
		route("models", "routes/models.tsx"),
		route("fuel-types", "routes/fuel-types.tsx"),
		route("transmissions", "routes/transmissions.tsx"),
		route("drive-types", "routes/drive-types.tsx"),
		route("status", "routes/statuses.tsx"),
		route("enquiries/vehicles", "routes/enquiries.vehicles.tsx"), // New route for vehicle-originated enquiries
		route("car-submissions", "routes/car-submissions.tsx"),
		route("enquiries/financing", "routes/enquiries.financing.tsx"), // Financing enquiries
		route("sales", "routes/sales.tsx"), // Sales management
	]),
] satisfies RouteConfig;
