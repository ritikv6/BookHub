import axios from "axios";

const API = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

export const getBooks = async (query = "programming") => {
  const response = await API.get("/volumes", {
    params: {
      q: query,
      maxResults: 20,
    },
  });

  return response.data.items || [];
};

export const getBookById = async (id) => {
  const response = await API.get(`/volumes/${id}`);

  return response.data;
};