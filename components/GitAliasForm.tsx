import { useState, useEffect } from "react";
import { AliasProviderMap } from "../types/AliasMap";
import axios from "axios";

type GitAliasFormProps = {
  userId: string;
};

const GitAliasForm: React.FC<GitAliasFormProps> = ({ userId }) => {
  const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch Git email aliases map on component mount
    const fetchData = async () => {
      try {
        console.log(`[GitAliasForm] userId = ${userId}`)
        const response = await axios.get(`/api/alias?user_id=${userId}`);
        console.log(`[GitAliasForm] response = ${JSON.stringify(response)}`)
        if (!response) {
          throw new Error('Failed to fetch Git email aliases');
        }
        const aliasData: { aliasProviderMap: AliasProviderMap } = JSON.parse(response.data);
        console.log(`[GitAliasForm] aliasData = ${aliasData}`);
        setGitAliasMap(aliasData.aliasProviderMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Git email aliases:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/alias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gitAliasMap),
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
          {gitAliasMap.aliases.map((handleMap, index) => (
            <div key={index}>
              <span>{handleMap.provider}</span>
              {handleMap.handles.map((aliasMap, innerIndex) => (
                <div key={innerIndex}>
                  <span>{aliasMap.alias}</span>
                  <input
                    type="text"
                    value={aliasMap.handles.join(',')}
                    // You need to handle onChange event to update the state properly
                  />
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </>
      ) : (
        <div>No data available</div>
      )}
    </form>
  );
};

export default GitAliasForm;