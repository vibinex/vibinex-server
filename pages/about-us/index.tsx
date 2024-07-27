import OurInvestors from "../../components/aboutus/our-investors";
import OurPrinciples from "../../components/aboutus/our-principles";
import OurTeam from "../../components/aboutus/our-team";
import Footer from "../../components/Footer";
import MainAppBar from "../../views/MainAppBar";

const AboutUs = () => {
  return (
    <div>
      <MainAppBar />
      <div className="p-10">
        <OurPrinciples />
        <OurTeam />
        <OurInvestors />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
