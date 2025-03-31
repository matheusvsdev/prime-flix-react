import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  useEffect(() => {
    async function loadFilmes() {
      const response = await api.get("movie/popular", {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          language: "pt-BR",
          page,
        },
      });
      setFilmes(response.data.results.slice(0, 12));
      setTotalPages(response.data.total_pages);
      setLoading(false);
    }
    loadFilmes();
  }, [page]);

  const renderPagination = () => {
    const pages = [];

    // Páginas ao redor da atual
    const startPage = Math.max(1, page - 2); // Até 2 páginas antes da atual
    const endPage = Math.min(totalPages, page + 1); // Até 0 páginas depois da atual

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={page === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loading">
          <h2>Carregando...</h2>
        </div>
      ) : (
        <>
          <div className="lista-filmes">
            {filmes.map((filme) => (
              <article key={filme.id}>
                <strong>{filme.title}</strong>
                <img
                  src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                  alt={filme.title}
                />
                <Link to={`/filme/${filme.id}`}>Acessar</Link>
              </article>
            ))}
          </div>
          <div className="paginacao">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Anterior
            </button>
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
