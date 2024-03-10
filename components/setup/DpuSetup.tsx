import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";

interface DpuSetupProps {
    userId: string;
    selectedProvider: string;
    selectedInstallationType: string;
}

export type RepoIdentifier = { repo_provider: string, repo_owner: string, repo_name: string };

const DpuSetup: React.FC<DpuSetupProps> = ({ userId, selectedInstallationType, selectedProvider }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [selfHostingCode, setSelfHostingCode] = useState<string>("Generating topic name, please try refreshing if you keep seeing this...");
    const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
    const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);

    useEffect(() => {
        if (selectedInstallationType === 'individual' && selectedProvider === 'github') {
            axios.get('/api/docs/getUserRepositories')
                .then(response => {
                    setAllRepos(response.data); // Assuming the API returns an array of RepoIdentifiers
                })
                .catch(error => {
                    console.error("Error fetching repos:", error);
                });
        }
        axios.post('/api/dpu/pubsub', { userId }).then((response) => {
            if (response.data.installId) {
                if (selectedInstallationType === 'individual' && selectedProvider === 'github'){
                    setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
                    `);
                } else if (selectedInstallationType === 'individual' && selectedProvider === 'bitbucket'){
                    setSelfHostingCode(`
Coming Soon!
                    `)
                } else {
                    setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} asia.gcr.io/vibi-prod/dpu/dpu
                    `);
                }
            }
            console.log("[DpuSetup] topic name ", response.data.installId);
        }).catch((error) => {
            setSelfHostingCode(`Unable to get topic name for user\nPlease refresh this page and try again.`);
            console.error(`[DpuSetup] Unable to get topic name for user ${userId} - ${error.message}`);
        });
    }, [userId, selectedInstallationType, selectedProvider]);

    const handleCopyClick = () => {
        setIsButtonDisabled(true);
    };

    const handleCopy = () => {
        setIsCopied(true);
        setIsButtonDisabled(false);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, repo: RepoIdentifier) => {
        if (event.target.checked) {
            setSelectedRepos([...selectedRepos, repo]);
        } else {
            setSelectedRepos(selectedRepos.filter(selectedRepo => selectedRepo !== repo));
        }
    };

    const handleSelectAll = () => {
        if (!selectAll) {
            setSelectedRepos([...allRepos]);
        } else {
            setSelectedRepos([]);
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = () => {
        // Call your backend Next.js API to submit selected repos
        axios.post('/api/your-submit-api-endpoint', { userId, selectedRepos })
            .then(response => {
                // Handle success
                console.log("Repos submitted successfully:", response.data);
                // Set selfHostingCode based on selected repos
                setSelfHostingCode(`Your self hosting code here`);
                setSubmissionStatus(true);
            })
            .catch(error => {
                console.error("Error submitting repos:", error);
            });
    };

    return (
        <div style={{ position: 'relative' }}>
            {submissionStatus ? (
                <div>
                    <pre>{selfHostingCode}</pre>
                    <CopyToClipboard text={selfHostingCode} onCopy={handleCopy}>
                        <button
                            style={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                            }}
                            onClick={handleCopyClick}
                            disabled={isButtonDisabled}
                        >
                            <MdContentCopy />
                        </button>
                    </CopyToClipboard>
                    {isCopied && <span style={{ position: 'absolute', top: '0', right: '50%', transform: 'translate(50%, -100%)', color: 'green' }}>Copied!</span>}
                </div>
            ) : (
                <div>
                    {selectedInstallationType === 'individual' && selectedProvider === 'github' &&
                        <div>
                            {allRepos.map((repo, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={`${repo.repo_owner}/${repo.repo_name}`}
                                        checked={selectedRepos.includes(repo)}
                                        onChange={(event) => handleCheckboxChange(event, repo)}
                                    />
                                    <label>{repo.repo_name}</label>
                                </div>
                            ))}
                            <button onClick={handleSelectAll}>{selectAll ? "Unselect All" : "Select All"}</button>
                            <button onClick={handleSubmit} disabled={selectedRepos.length === 0}>Submit</button>
                        </div>
                    }
                </div>

            )}
        </div>
    );
};

export default DpuSetup;
