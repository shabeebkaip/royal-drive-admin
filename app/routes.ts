import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	route("/", "routes/__app.tsx", [
		index("routes/dashboard.tsx"),
		route("vehicles", "routes/vehicles.tsx"),
		route("vehicles/add", "routes/vehicles.add.tsx"),
		route("vehicles/:id", "routes/vehicles.$id.tsx"),
		route("vehicles/:id/edit", "routes/vehicles.$id.edit.tsx"),
		route("makes", "routes/makes.tsx"),
		route("vehicle-types", "routes/vehicle-types.tsx"),
		route("models", "routes/models.tsx"),
		route("fuel-types", "routes/fuel-types.tsx"),
		route("transmissions", "routes/transmissions.tsx"),
	]),
] satisfies RouteConfig;
