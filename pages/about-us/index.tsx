import AdSec from "../../components/aboutus/ad-section";
import OurInvestors from "../../components/aboutus/our-investors";
import OurPrinciples from "../../components/aboutus/our-principles";
import OurTeam from "../../components/aboutus/our-team";
import ProductVision from "../../components/aboutus/product-vision";
import PurposeOfCompany from "../../components/aboutus/purpose";
import Footer from "../../components/Footer";
import MainAppBar from "../../views/MainAppBar";

const AboutUs = () => {
  return (
    <div>
      <MainAppBar />

      <div className=" bg-black ">
        <PurposeOfCompany />
        <ProductVision />
        <OurPrinciples />
        <OurTeam />
        <OurInvestors />
        <AdSec />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
