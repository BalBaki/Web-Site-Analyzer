import AnalyzeForm from '@/components/AnalyzeForm';

export default function HomePage() {
    return (
        <section aria-describedby="analyze-form">
            <h2
                id="analyze-form"
                className="sr-only"
            >
                Analyze Form
            </h2>
            <AnalyzeForm />
        </section>
    );
}
