import express from "express";
import authRoute from "./auth.route";
import orgRoute from "./org.route";
import featureRoute from "./feature.route";

const router = express.Router();

const defaultRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/organizations",
    route: orgRoute,
  },
  {
    path: "/features",
    route: featureRoute,
  },
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
