import { useState, useEffect } from "react";
import { AliasProviderMap, HandleMap, AliasMap } from "../types/AliasMap";
import axios from "axios";

type GitAliasFormProps = {
  userId: string;
};

const GitAliasForm: React.FC<GitAliasFormProps> = ({ userId }) => {
  const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`[GitAliasForm] userId = ${userId}`);
        const response = await axios.get(`/api/alias`);
        if (!response.data || !response.data.aliasProviderMap) {
          throw new Error('Failed to fetch Git email aliases');
        }
        console.log(`[GitAliasForm] map dummy change = ${JSON.stringify(response.data.aliasProviderMap)}`);
        setGitAliasMap(response.data.aliasProviderMap); // Corrected setting of state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Git email aliases:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleInputChange = (provider: string, aliasIndex: number, value: string) => {
    setGitAliasMap(prevState => {
      if (!prevState) return null;
      const updatedProviderMaps = prevState.providerMaps.map((providerMap, index) => {
        if (index !== aliasIndex) return providerMap;
        const updatedHandleMaps = providerMap.handleMaps.map(handleMap => {
          if (handleMap.provider === provider) {
            const existingHandleIndex = handleMap.handles.indexOf(value);
            const updatedHandles = existingHandleIndex !== -1 ?
              handleMap.handles.filter(handle => handle !== value) :
              [...handleMap.handles, value];
            return { ...handleMap, handles: updatedHandles };
          }
          return handleMap;
        });
        return { ...providerMap, handleMaps: updatedHandleMaps };
      });
      return { ...prevState, providerMaps: updatedProviderMaps };
    });
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/alias', gitAliasMap, {
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
                    value=""
                    onChange={(e) => handleInputChange('github', providerMapIndex, e.target.value)}
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
                    value=""
                    onChange={(e) => handleInputChange('bitbucket', providerMapIndex, e.target.value)}
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
