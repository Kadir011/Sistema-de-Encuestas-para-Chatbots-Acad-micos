import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sobre el proyecto */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">ChatBot Survey</h3>
                        <p className="text-gray-400 mb-4">
                            Plataforma para recopilar y analizar el uso de chatbots de IA 
                            en el ámbito educativo.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/Kadir011"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/kadir-barquet-bravo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="barquetbravokadir@gmail.com"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Acerca de
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Términos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Recursos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/help"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Ayuda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/documentation"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Documentación
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>© {currentYear} ChatBot Survey. Desarrollado por Kadir Barquet.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;