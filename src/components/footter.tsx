import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                    <p className="text-gray-300 font-semibold">© 2025 RoTrade | สงวนลิขสิทธิ์ทั้งหมด</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><BsFacebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><BsInstagram size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><BsTwitter size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}