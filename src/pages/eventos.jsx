import React, { useEffect, useState } from 'react';
import './eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [indexBanner, setIndexBanner] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
 const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;



  const getMaiorImagem = (images) => {
    if (!images || images.length === 0) return '';
    return images.reduce((maior, atual) => (atual.width > maior.width ? atual : maior)).url;
  };

  useEffect(() => {
    const estadosBrasil = [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
      "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    const buscarEventosPorEstado = async (estado) => {
      try {
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&countryCode=BR&stateCode=${estado}&size=100`);

        const data = await response.json();
        return data._embedded?.events || [];
      } catch (error) {
        console.error(`Erro ao buscar eventos para ${estado}:`, error);
        return [];
      }
    };

    const buscarEventos = async () => {
      setCarregando(true);
      try {
        const promessas = estadosBrasil.map(estado => buscarEventosPorEstado(estado));
        const resultados = await Promise.all(promessas);
        const todosEventos = resultados.flat(); // Junta os arrays de cada estado
        setEventos(todosEventos);
      } catch (erro) {
        console.error('Erro ao buscar eventos:', erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarEventos();
  }, []);

  const eventosOrdenadosPorData = [...eventos].sort((a, b) => {
    const dataA = new Date(a.dates?.start?.dateTime || a.dates?.start?.localDate);
    const dataB = new Date(b.dates?.start?.dateTime || b.dates?.start?.localDate);
    return dataA - dataB;
  });

  const eventosParaBanner = eventosOrdenadosPorData.slice(0, 3);
  const eventoPrincipal = eventosParaBanner.length > 0 ? eventosParaBanner[indexBanner] : null;

  // Filtro de pesquisa aplicado apenas na exibição dos eventos, não durante a busca
  const eventosFiltrados = eventosOrdenadosPorData.filter(evento =>
    evento.name.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
  };

  const getCidade = (evento) => {
    return evento._embedded?.venues?.[0]?.city?.name || 'Cidade não disponível';
  };

  // Funções para navegar entre os banners
  const navegarParaEsquerda = () => {
    setIndexBanner((prevIndex) => (prevIndex - 1 + 3) % 3); // Volta para o banner anterior
  };

  const navegarParaDireita = () => {
    setIndexBanner((prevIndex) => (prevIndex + 1) % 3); // Vai para o próximo banner
  };

  return (
    <div className="eventos-page">
      <div className="header">
        <div className="topo-header">
          <h2 className="logo">Bora Lá!</h2>
          <form className="barra-pesquisa-container" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="barra-pesquisa"
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={handlePesquisaChange}
            />
            <button type="submit" className="barra-pesquisa-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>

        </div>
      </div>

      {eventoPrincipal && pesquisa.trim() === '' && (
        <div className="evento-principal-banner">
          <button className="seta-esquerda" onClick={navegarParaEsquerda}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="evento-banner">
            <img
              src={getMaiorImagem(eventoPrincipal.images)}
              alt={eventoPrincipal.name}
              className="evento-banner-img"
            />
            <div className="evento-banner-info">
              <div className="evento-banner-texto">
                <h3>{eventoPrincipal.name}</h3>
                {eventoPrincipal.info && <p>{eventoPrincipal.info}</p>}
                {eventoPrincipal.dates?.start?.localDate && (
                  <p>
                    <strong>Data:</strong> {new Date(`${eventoPrincipal.dates.start.localDate}T${eventoPrincipal.dates.start.localTime || '00:00'}`).toLocaleDateString('pt-BR')}
                  </p>
                )}
                <a className="detalhes" href={eventoPrincipal.url} target="_blank" rel="noopener noreferrer">
                  Ver Detalhes
                </a>
              </div>
            </div>
          </div>
          <button className="seta-direita" onClick={navegarParaDireita}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <div className="body">
        {carregando ? (
          <p>Carregando eventos...</p>
        ) : eventosFiltrados.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <div className="eventos-lista">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="evento-card">
                <img src={getMaiorImagem(evento.images)} alt={evento.name} className="evento-img" />
                <h3>{evento.name}</h3>
                {evento.dates?.start?.localDate && (
                  <p className="evento-data">
                    Data: {new Date(`${evento.dates.start.localDate}T${evento.dates.start.localTime || '00:00'}`).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                <p className="evento-cidade">{getCidade(evento)}</p>
                {evento.info && <p className="descricaos">{evento.info}</p>}
                <a className="ver-mais" href={evento.url} target="_blank" rel="noopener noreferrer">
                  Ver Detalhes
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventos;
