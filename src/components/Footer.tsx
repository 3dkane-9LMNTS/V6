import React from 'react';
import { Instagram, Twitter, Linkedin, Mail, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, plan?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#FF7A00]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-gray-400 text-sm mb-4">9LMNTS Studio</div>
            <p className="text-white font-bold text-lg">Lead Orchestrator Agent</p>
            <p className="text-gray-400 text-sm">Where Digital Design Enters <span className="font-graffiti text-[#FF7A00]">CYBER CYPHER</span></p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#FF7A00] transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-[#FF7A00] transition-colors">Services</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-[#FF7A00] transition-colors">Pricing</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#FF7A00] transition-colors">About</button></li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/9lmnts" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/9lmnts" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/9lmnts" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:contact@9lmntsstudio.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => onNavigate('terms')} className="hover:text-[#FF7A00] transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#FF7A00] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('agreement')} className="hover:text-[#FF7A00] transition-colors">Service Agreement</button></li>
            </ul>
          </div>
          
          {/* Copyright */}
          <div className="col-span-1 md:col-span-4">
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; 2024 9LMNTS Studio. All rights reserved.</p>
              <p className="flex items-center justify-center space-x-2">
                <span>Powered by</span>
                <span className="text-[#FF7A00] font-bold">L.O.A.</span>
                <span>Lead Orchestrator Agent</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
