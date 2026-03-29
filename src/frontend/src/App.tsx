import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import SurveyForm from "./pages/SurveyForm";

function getRoute() {
  const hash = window.location.hash;
  if (hash.startsWith("#/admin")) return "admin";
  return "home";
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      {route === "admin" ? <AdminDashboard /> : <SurveyForm />}
      <Toaster position="top-right" richColors />
    </>
  );
}
