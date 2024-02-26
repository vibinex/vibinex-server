import Footer from "../components/Footer";
import GitAliasForm from "../components/GitAliasForm";
import MainAppBar from "../views/MainAppBar";

const ExpandedGitAliasFormPage: React.FC = () => {
  return <>
    <MainAppBar />
    <GitAliasForm expanded={true} />
    <Footer />
  </>
};

export default ExpandedGitAliasFormPage;
