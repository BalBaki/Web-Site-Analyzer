import AnalyzeForm from '@/components/home/analyze-form';
import Features from '@/components/home/Features';
import Info from '@/components/home/Info';

export default function HomePage() {
    return (
        <div className="container mx-auto mb-4">
            <AnalyzeForm />
            <Info />
            <Features />
        </div>
    );
}
