import { useState, useEffect } from 'react'; 

export default function App() {
    const [search, setSearch] = useState("");
    const [gefunden, setGefunden] = useState([]);
    const [ausgeklappteSerie, setAusgeklappteSerie] = useState(null);

    const [wishlist, setWishlist] = useState(() => {
        const gespeicherteDaten = localStorage.getItem('wishlist');
        return gespeicherteDaten ? JSON.parse(gespeicherteDaten) : [];
    });
    
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    async function loadAPI(search) {
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`);

            if (!response.ok) {
                throw new Error(`http-status: ${response.status}`);
            }

            const daten = await response.json();
            setGefunden(daten);
            console.log("erfolgreich geladen", daten);     
        } catch(error) {
            console.error(alert(error));
        }
    }

    function LiErzeugen({ serie, ausgeklappt, onClick }) {
        const show = serie.show;

        return (
            <li
                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md ${ausgeklappt ? "col-span-full" : ""}`}
                onClick={onClick}
            >
                <div className="flex gap-4">
                    {show.image?.medium && (
                        <img 
                            src={show.image.medium} 
                            alt={show.name} 
                            className="w-24 h-36 object-cover rounded-md"
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">{show.name}</h3>
                        <p className="text-gray-600">Score: {serie.score.toFixed(2)}</p>
                    </div>
                </div>

                {ausgeklappt && (
                    <div className="mt-4 border-t pt-4 flex flex-col gap-3">
                        <div
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: show.summary || "Keine Beschreibung vorhanden."
                            }}
                        />

                        <p><strong>Genres:</strong> {show.genres.join(", ") || "Keine Angaben"}</p>
                        <p><strong>Premiere:</strong> {show.premiered || "Unbekannt"}</p>
                        <p><strong>Status:</strong> {show.status || "Unbekannt"}</p>

                        <button 
                            className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setWishlist([...wishlist, serie]);
                            }}
                        >
                            Zur Wishlist hinzufügen
                        </button>
                    </div>
                )}
            </li>
        );
    }

    function LiErzeugenWishlist({ serie, ausgeklappt, onClick, index }) {
        const show = serie.show;

        return (
            <li
                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md ${ausgeklappt ? "col-span-full" : ""}`}
                onClick={onClick}
            >
                <div className="flex gap-4">
                    {show.image?.medium && (
                        <img 
                            src={show.image.medium} 
                            alt={show.name} 
                            className="w-24 h-36 object-cover rounded-md"
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">{show.name}</h3>
                        <p className="text-gray-600">Score: {serie.score.toFixed(2)}</p>
                    </div>
                </div>

                {ausgeklappt && (
                    <div className="mt-4 border-t pt-4 flex flex-col gap-3">
                        <div
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: show.summary || "Keine Beschreibung vorhanden."
                            }}
                        />

                        <p><strong>Genres:</strong> {show.genres.join(", ") || "Keine Angaben"}</p>
                        <p><strong>Premiere:</strong> {show.premiered || "Unbekannt"}</p>
                        <p><strong>Status:</strong> {show.status || "Unbekannt"}</p>

                        <button 
                            className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setWishlist(alteWishlist => alteWishlist.filter((element, i) => i !== index));
                            }}
                        >
                            Von Wishlist entfernen
                        </button>
                    </div>
                )}
            </li>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Serie finden & wishlisten APP
                </h1>

                <fieldset className="bg-white p-4 rounded-lg shadow">
                    <legend className="font-bold text-lg px-2">Suchfeld</legend>

                    <form 
                        className="flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            loadAPI(search);
                        }}
                    >
                        <input
                            className="border border-gray-300 rounded-md p-2 flex-1"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Serie eingeben..."
                        />

                        <button 
                            className="bg-blue-600 text-white rounded-md px-5 hover:bg-blue-700"
                            type="submit"
                        >
                            Suchen
                        </button>
                    </form>
                </fieldset>

                <fieldset className="bg-white p-4 rounded-lg shadow">
                    <legend className="font-bold text-xl px-2">Serien</legend>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gefunden.map((element) => (
                            <LiErzeugen
                                key={element.show.id}
                                serie={element}
                                ausgeklappt={ausgeklappteSerie === element.show.id}
                                onClick={() => setAusgeklappteSerie(
                                    ausgeklappteSerie === element.show.id
                                        ? null
                                        : element.show.id
                                )}
                            />
                        ))}
                    </ul>
                </fieldset>

                <fieldset className="bg-white p-4 rounded-lg shadow">
                    <legend className="font-bold text-xl px-2">Wishlist</legend>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((element, index) => (
                            <LiErzeugenWishlist
                                key={element.show.id}
                                index={index}
                                serie={element}
                                ausgeklappt={ausgeklappteSerie === element.show.id}
                                onClick={() => setAusgeklappteSerie(
                                    ausgeklappteSerie === element.show.id
                                        ? null
                                        : element.show.id
                                )}
                            />
                        ))}
                    </ul>
                </fieldset>

            </div>
        </div>
    );
}