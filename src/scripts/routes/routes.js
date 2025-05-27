import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import StoryPage from "../pages/story/story-page";
import LoginPage from "../pages/login/login-page";
import StoryDetail from "../pages/detail-story/detail-story-page";
import AddStoryPage from "../pages/addStory/addStory-page";
import RegisterPage from "../pages/register/register-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/story": new StoryPage(),
  "/login": new LoginPage(),
  "/story/:id": new StoryDetail(),
  "/addStory": new AddStoryPage(),
  "/register": new RegisterPage(),
};

export default routes;
