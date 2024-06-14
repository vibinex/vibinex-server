import Footer from '../../../components/Footer';
import { RenderMarkdown } from '../../../components/RenderMarkdown';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import MainAppBar from '../../../views/MainAppBar';

const StartingVMInCloud = () => {
	const markdownText = `
## Starting a VM in the Cloud for Vibinex DPU

To run the Vibinex DPU, you need a VM with the following minimum configuration:

- RAM: 2 GB
- CPU: 2 vCPUs or 4 vCPUs
- Storage: Depends on the size of your codebase, maximum supported is 20 GB

Here are the official guides for starting a VM on various cloud providers:

### Google Cloud Platform (GCP)

Follow the [GCP guide for creating a new VM instance](https://cloud.google.com/compute/docs/instances/create-start-instance).

### Amazon Web Services (AWS)

Follow the [AWS guide for launching a new EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/LaunchingAndUsingInstances.html).

### Microsoft Azure

Follow the [Azure guide for creating a new virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal).

### Digital Ocean

Follow the [Digital Ocean guide for creating a new Droplet](https://docs.digitalocean.com/products/droplets/how-to/create/).

Make sure to select the appropriate instance type or machine size to meet the minimum requirements for Vibinex DPU.
  `;

	return (
		<div>
			<MainAppBar />
			<div className="flex">
				<div className="w-1/4">
					<DocsSideBar />
				</div>
				<div className="w-3/4">
					<RenderMarkdown markdownText={markdownText} />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default StartingVMInCloud;
