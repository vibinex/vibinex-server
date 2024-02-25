import GitAliasForm from "../components/GitAliasForm";
import MainAppBar from "../views/MainAppBar";

const ExpandedGitAliasFormPage: React.FC = () => {
  return <>
    <MainAppBar />
    <GitAliasForm expanded={true} />;
  </>
};

export default ExpandedGitAliasFormPage;
