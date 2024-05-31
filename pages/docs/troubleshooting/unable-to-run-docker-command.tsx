import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import Footer from '../../../components/Footer';
import MainAppBar from '../../../views/MainAppBar';
import DocsSideBar from '../../../views/docs/DocsSideBar';
import { RenderMarkdown } from '../../../components/RenderMarkdown';

const UnableToRunDockerCommand = () => {
	const markdownText = `
### Unable to run docker commands

If you encounter issues while running \`docker pull\` or \`docker run\` commands, here are some common resolutions with links to official Docker documentation:

1. **Docker not installed**: If Docker is not installed on your system, follow the official [Docker installation guide](https://docs.docker.com/get-docker/) for your operating system.

2. **Permission denied**: If you receive a "permission denied" error, you may need to run the Docker commands with \`sudo\`. Alternatively, you can follow the [Docker post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) to add your user to the "docker" group.

3. **Docker daemon not running**: If the Docker daemon is not running, you can start it by following the instructions in the [Docker documentation](https://docs.docker.com/config/daemon/).

4. **Network issues**: If you encounter network-related issues while pulling or running Docker images, refer to the [Docker networking troubleshooting guide](https://docs.docker.com/network/troubleshoot-app-networking/).

5. **Image not found**: If the Docker image you're trying to pull is not found, ensure you're using the correct image name and tag. You can also try pulling from a different Docker registry or mirror.

6. **Container exited with error**: If your Docker container exits with an error, check the container logs using \`docker logs <container_id>\` and refer to the [Docker troubleshooting guide](https://docs.docker.com/config/containers/start-containers-automatically/) for more information.

7. **Resource constraints**: If you encounter resource-related issues (e.g., insufficient memory or CPU), refer to the [Docker resource constraints documentation](https://docs.docker.com/config/containers/resource_constraints/) for guidance on managing container resources.

For more detailed troubleshooting and advanced scenarios, consult the official [Docker documentation](https://docs.docker.com/get-started/) and [Docker troubleshooting guide](https://docs.docker.com/config/troubleshoot/).
`;

	return (
		<div>
			<MainAppBar />
			<div className="flex flex-col sm:flex-row">
				<DocsSideBar className='w-full sm:w-80' />

				<div className='sm:w-2/3 mx-auto mt-8 px-2 py-2'>
					<RenderMarkdown markdownText={markdownText} />
				</div>

			</div>
			<Footer />
		</div>
	)
}

export default UnableToRunDockerCommand
