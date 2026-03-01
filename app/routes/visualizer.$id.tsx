import {useLocation, useParams} from "react-router";


const VisualizerId = () => {
    const { id } = useParams();
    const location = useLocation();
    const {initialImage, name} = (location.state as { initialImage?: string, name?: string }) || {};


    return (
        <section>
            <h1>{name || 'Untitled Project'} {id ? `(${id})` : ''}</h1>

            <div className="visualizer">
                {initialImage && (
                    <div className="image-container">
                        <h2>Source Image</h2>
                        <img src={initialImage} alt="Source" />

                    </div>
                )}

            </div>
        </section>
    )
}
export default VisualizerId
