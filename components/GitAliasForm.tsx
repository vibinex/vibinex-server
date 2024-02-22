import { useState, useEffect } from "react";
import { AliasProviderMap, AliasMap } from "../types/AliasMap";
import axios from "axios";


const GitAliasForm: React.FC = () => {
  const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [handleInputValues, setHandleInputValues] = useState<{ [key: string]: { github: string; bitbucket: string } }>({});

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

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <div>Loading...</div>
      ) : gitAliasMap ? (
        <>
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-gray-300">
            <div className="p-4">
              <h3>Alias</h3>
            </div>
            <div className="p-4">
              <h3>github</h3>
            </div>
            <div className="p-4">
              <h3>bitbucket</h3>
            </div>
          </div>
  
          {/* Rows */}
          {gitAliasMap.providerMaps.map((providerMap: AliasMap, providerMapIndex) => (
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
                  <div key={handleIndex}>{handle}</div>
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
                  <div key={handleIndex}>{handle}</div>
                ))}
              </div>
            </div>
          ))}
          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit</button>
        </>
      ) : (
        <div>No data available</div>
      )}
    </form>
  );
};

export default GitAliasForm;
