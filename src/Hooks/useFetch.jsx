import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = (url, options) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const URL = import.meta.env.VITE_APP_API_BASE_URL + url;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")?.replace(/"/g, "");
        if (!token) {
          console.log("token not found, navigating to login");
          navigate("/login");
        }

        const res = await fetch(URL, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res);

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error(res.statusText);
        }

        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);
  // }, [url, options.headers, navigate]);

  return { data, loading, error };
};

export default useFetch;
