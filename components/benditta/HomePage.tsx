"use client"
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import styles from "./styleBenditta.module.css";

const HomePage: React.FC = () => {
//export default function Home() {
    return (
        <>
        <div className={styles.pageWrapper}>
        <Header />
        <Hero />
        <About />
        <Menu />
        <Contact /> 
        <Footer />
        </div>
        </>
    );
}
export default HomePage;