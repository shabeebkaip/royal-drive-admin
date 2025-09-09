import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	route("/", "routes/__app.tsx", [
		index("routes/dashboard.tsx"),
	]),
] satisfies RouteConfig;
