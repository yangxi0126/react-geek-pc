import { Routes, Route } from "react-router-dom";
import AuthRoute from "@/components/AuthRoute";
import { lazy, Suspense } from "react";
import { HistoryRouter, history } from "@/utils";

const Login = lazy(() => import("@/pages/Login"));
const Layout = lazy(() => import("@/pages/Layout"));
const HomeLand = lazy(() => import("@/pages/Home"));
const Article = lazy(() => import("@/pages/Article"));
const Publish = lazy(() => import("@/pages/Publish"));

function App() {
  return (
    <HistoryRouter history={history}>
      <Suspense>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/" element={
              <AuthRoute>
                <Layout/>
              </AuthRoute>
            }>
              <Route path="" element={<HomeLand/>}></Route>
              <Route path="article" element={<Article/>}></Route>
              <Route path="publish" element={<Publish/>}></Route>
            </Route>
          </Routes>
        </div>
      </Suspense>
    </HistoryRouter>
  );
}

export default App;
