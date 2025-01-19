import { Footer } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
export default function Foot() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6">
                {/* ข้อมูลบริษัท */}
                <div className="flex flex-wrap justify-between gap-8">
                    <div className="w-full sm:w-1/4">
                        <h5 className="text-xl font-semibold mb-4">Company</h5>
                        <ul>
                            <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/4">
                        <h5 className="text-xl font-semibold mb-4">Help</h5>
                        <ul>
                            <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/4">
                        <h5 className="text-xl font-semibold mb-4">Social</h5>
                        <ul className="flex space-x-6 ">
                            <a href="#" className="text-gray-400 hover:text-white mr-2"><BsFacebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white mr-2"><BsInstagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white mr-2"><BsTwitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white mr-2"><BsGithub /></a>
                            <a href="#" className="text-gray-400 hover:text-white mr-2"><BsDribbble /></a>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/4">
                        <h5 className="text-xl font-semibold mb-4">Download</h5>
                        <ul>
                            <li><a href="#" className="text-gray-400 hover:text-white">iOS</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Android</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Windows</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">MacOS</a></li>
                        </ul>
                    </div>
                </div>

                {/* ลิขสิทธิ์และไอคอน */}
                <div className="border-t border-gray-700 mt-8 pt-6 flex justify-between items-center">
                    <p className="text-gray-400 text-sm">&copy; 2022 Your Company. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="text-gray-400 hover:text-white mr-2"><BsFacebook /></a>
                        <a href="#" className="text-gray-400 hover:text-white mr-2"><BsInstagram /></a>
                        <a href="#" className="text-gray-400 hover:text-white mr-2"><BsTwitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white mr-2"><BsGithub /></a>
                        <a href="#" className="text-gray-400 hover:text-white mr-2"><BsDribbble /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
