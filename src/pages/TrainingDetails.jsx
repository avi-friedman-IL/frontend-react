import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { loadTraining } from "../store/actions/training.actions"

export function TrainingDetails() {
    const {id} = useParams()
    const [training, setTraining] = useState(null)

    useEffect(() => {
      load()
    }, [id])

    async function load() {
        try {
            const training = await loadTraining(id)
            setTraining(training)
        } catch (err) {
            console.log('Cannot load training', err)
        }
    }
    if (!training) return <div>Loading...</div>
    return (
        <section className="training-details" style={{userSelect: 'none'}}>
            <div className="training-details-middle">
                <h1>{training.title}</h1>
                <ul className="training-details-items">
                    {training.items.map(item => (
                        <li dangerouslySetInnerHTML={{ __html: item.text }} key={item.id}></li>
                    ))}
                </ul>
            </div>
        </section>
    )
}