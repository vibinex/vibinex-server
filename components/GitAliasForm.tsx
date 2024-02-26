import { useState, useEffect } from "react";
import { AliasProviderMap, AliasMap } from "../types/AliasMap";
import axios from "axios";
import { useRouter } from 'next/router';
import Chip from "./Chip";

const GitAliasForm: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [handleInputValues, setHandleInputValues] = useState<{ [key: string]: { github: string; bitbucket: string } }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/alias`);
        if (!response.data || !response.data.aliasProviderMap) {
          throw new Error('Failed to fetch Git email aliases');
        }
        setGitAliasMap(response.data.aliasProviderMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Git email aliases:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (alias: string, provider: string, value: string) => {
    setHandleInputValues(prevState => ({
      ...prevState,
      [alias]: {
        ...prevState[alias],
        [provider]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!gitAliasMap) {
        throw new Error('No new value to submit');
      }
      const updatedProviderMaps = gitAliasMap.providerMaps.map(providerMap => {
        const updatedHandleMaps = providerMap.handleMaps.map(handleMap => {
          const inputValue = handleInputValues[providerMap.alias]?.[handleMap.provider as keyof typeof handleInputValues['']];
          const updatedHandles = inputValue ? [inputValue.toString()] : [];
          return { ...handleMap, handles: updatedHandles };
        });
        return { ...providerMap, handleMaps: updatedHandleMaps };
      });

      const updatedGitAliasMap = { providerMaps: updatedProviderMaps };
      const response = await axios.post('/api/alias', { aliasProviderMap: updatedGitAliasMap }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response) {
        throw new Error('Failed to save Git alias map');
      }
      alert("Git aliases updated successfully!");
    } catch (error) {
      console.error("Error saving Git aliases:", error);
      alert("An error occurred while saving Git aliases. Please try again.");
    }
  };

  const expandForm = () => {
    router.push('/expanded-git-alias-form');
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <div>Loading...</div>
      ) : gitAliasMap ? (
        <>
          {!expanded && (
            <div className="bg-blue-200 text-blue-800 p-4 rounded-md mb-4 text-center">
              <p className="font-bold">Please enter Github/Bitbucket usernames and click Submit:</p>
            </div>
          )}
          {/* Header */}
          <div className="grid grid-cols-3 border-b text-blue-800">
            <div className="p-4">
              <h3 className="text-center font-bold">Alias</h3>
            </div>
            <div className="p-4">
              <h3 className="text-center font-bold">Github</h3>
            </div>
            <div className="p-4">
              <h3 className="text-center font-bold">Bitbucket</h3>
            </div>
          </div>

          {/* Rows */}
          {gitAliasMap.providerMaps.map((providerMap: AliasMap, providerMapIndex) => {
            const hasHandles = providerMap.handleMaps && providerMap.handleMaps.some(handleMap => handleMap.handles.length > 0);
            return expanded || !hasHandles ? (
              <div key={providerMapIndex} className="grid grid-cols-3 border-b border-gray-300">
                {/* Alias column */}
                <div className="p-4">
                  <div>{providerMap.alias}</div>
                </div>

                {/* github column */}
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      value={handleInputValues[providerMap.alias]?.github || ''}
                      onChange={(e) => handleInputChange(providerMap.alias, 'github', e.target.value)}
                      className="mb-2 w-full"
                    />
                  </div>
                  {/* Display additional handles beneath the input field if available */}
                  {providerMap.handleMaps?.find(handleMap => handleMap.provider === 'github')?.handles.map((handle: string, handleIndex: number) => (
                    <Chip key={handleIndex} name={handle} avatar={"/github-dark.svg"} disabled={false} />
                  ))}
                </div>

                {/* bitbucket column */}
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      value={handleInputValues[providerMap.alias]?.bitbucket || ''}
                      onChange={(e) => handleInputChange(providerMap.alias, 'bitbucket', e.target.value)}
                      className="mb-2 w-full"
                    />
                  </div>
                  {/* Display additional handles beneath the input field if available */}
                  {providerMap.handleMaps?.find(handleMap => handleMap.provider === 'bitbucket')?.handles.map((handle: string, handleIndex: number) => (
                    <Chip key={handleIndex} name={handle} avatar={"/bitbucket-dark.svg"} disabled={false} />
                  ))}
                </div>
              </div>
            ) : null;
          })}
          {/* Buttons */}
          <div className="mt-4">
            <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded ${expanded ? 'w-full block mb-4' : ''}`}>Submit</button>
            {!expanded && (
              <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4 w-full" onClick={expandForm}>Expand</button>
            )}
          </div>
        </>
      ) : (
        <div>No data available</div>
      )}
    </form>
  );
};

export default GitAliasForm;
