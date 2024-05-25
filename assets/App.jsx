import React from "react";
import SfReactMap from "./pages/SfReactMap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Equipment from "./pages/Equipment";
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowTopic from "./pages/ShowTopic";
import CreateEquipment from "./forms/CreateEquipment";
import CreateArticle from "./forms/CreateArticle";
import CreateTopic from "./forms/CreateTopic";
import Profile from "./pages/Profile";
import NavbarMap from "./components/NavbarMap";
import AdminRoute from "./components/AdminRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import TopicsList from "./pages/TopicsList";
import CreateSection from "./forms/CreateSection";
import EditSection from "./forms/EditSection";
import EditArticle from "./forms/EditArticle";

export default function App() {
	return (
		<BrowserRouter>
			<NavbarMap />
			<Routes>
				{/* Public Route */}
				<Route path="/home" element={<Home />} />
				<Route path="/map" element={<SfReactMap />} />
				<Route path="/equipment" element={<Equipment />} />
				<Route path="/forum" element={<Forum />} />
				<Route path="/forum/topics" element={<TopicsList />} />
				<Route path="/forum/topic/:topicId" element={<ShowTopic />} />

				{/* Route for non logged user Only */}
				<Route element={<UnauthenticatedRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>

				{/* Route for logged user Only */}
				<Route element={<AuthenticatedRoute />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/article/create" element={<CreateArticle />} />
					<Route path="/article/edit/:articleId" element={<EditArticle />} />

					<Route path="/section/create" element={<CreateSection />} />
					<Route path="/section/edit/:sectionId" element={<EditSection />} />

					<Route path="/equipment/create" element={<CreateEquipment />} />
					<Route path="/topic/create" element={<CreateTopic />} />
				</Route>

				{/* Route for Admin Only */}
				<Route element={<AdminRoute />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
