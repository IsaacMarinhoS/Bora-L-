import './home.css';
import danca from '../img/dancando.png'



const Home = () => {
    return (
        <div className="banner-container">
            <div className="textobanner">
                <p className='texto'><strong>Encontre os melhores eventos perto de você</strong></p>
                <p className='descricao'>
                    <strong>Descubra eventos incríveis, festas exclusivas e baladas que estão bombando na sua região.<br/> Tudo em um só lugar, fácil e rápido.</strong>
                </p>
                <a className='espaco' href="/eventos"><button className='botao'>explorar<br /> eventos</button></a>
            </div>

            <div className="imagebanner">
                <img src={danca} alt="Festa animada" />
            </div>

            <div className="cards-container">
                <div className="card">
                    <h3 className='card-h3'>Festas Exclusivas</h3>
                    <p>Entre em eventos privados e descubra experiências únicas que poucos conhecem.</p>
                </div>
                <div className="card">
                    <h3 className='card-h3'>Baladas</h3>
                    <p>Conheça as baladas mais animadas da sua cidade com os melhores DJs e ambientes.</p>
                </div>
                <div className="card">
                    <h3 className='card-h3' >Shows</h3>
                    <p>Fique por dentro dos grandes shows e apresentações ao vivo que estão por vir.</p>
                </div>
            </div>

        </div>


    );
};

export default Home;
