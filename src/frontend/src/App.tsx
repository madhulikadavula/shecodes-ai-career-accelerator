import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import ContestPage from "@/pages/ContestPage";
import PracticePage from "@/pages/PracticePage";
import PrepPage from "@/pages/PrepPage";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import { ApiKeyProvider } from "@/context/ApiKeyContext";

// Root layout
function RootLayout() {
  return (
    <ApiKeyProvider>
      <div className="min-h-screen mesh-bg">
        <Navbar />
        <ApiKeyModal />
        <Outlet />
        <Toaster />
      </div>
    </ApiKeyProvider>
  );
}

// Routes
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const contestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contest",
  component: ContestPage,
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/practice",
  component: PracticePage,
});

const prepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prep",
  component: PrepPage,
});

const opportunitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/opportunities",
  component: OpportunitiesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  contestRoute,
  practiceRoute,
  prepRoute,
  opportunitiesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
