import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

const PromotionSection = ({ promotions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    if (selectedPromotion) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(selectedPromotion.end_date));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedPromotion]);

  const handlePromotionClick = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
    setTimeLeft(calculateTimeLeft(promotion.end_date));
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const formatDiscount = (value) => {
    if (typeof value === 'string') {
      return value.replace('-', '').split('.')[0];
    }
    return Math.abs(Math.floor(value));
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredPromotions = promotions.filter(
    promo => !promo.product && !promo.category
  );

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4 mb-8">
      {filteredPromotions.map((promotion) => (
        <div 
          key={promotion.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer"
          onClick={() => handlePromotionClick(promotion)}
        >
          <div className="p-4 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full shadow-lg">
              <Flame 
                className="w-8 h-8 text-orange-500 animate-pulse" 
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{promotion.title}</h3>
              <p className="text-gray-600 text-sm leading-4	">{truncateText(promotion.description)}</p>
            </div>
            
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{selectedPromotion.title}</h2>
                <p className="text-gray-600">{selectedPromotion.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full shadow-lg">
                    <Flame 
                      className="w-8 h-8 text-orange-500 animate-pulse" 
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
                      }}
                    />
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full text-2xl font-bold shadow-lg">
                    {selectedPromotion.discount_type === 'PERCENTAGE' ? (
                      <span>{formatDiscount(selectedPromotion.discount_display)}% OFF</span>
                    ) : (
                      <span>Ahorra ${formatDiscount(selectedPromotion.discount_value)}</span>
                    )}
                  </div>
                </div>

                {Object.keys(timeLeft).length > 0 && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-center font-semibold mb-2">Tiempo restante:</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <span className="text-xl font-bold">{timeLeft.days}</span>
                        <p className="text-sm">Días</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold">{timeLeft.hours}</span>
                        <p className="text-sm">Horas</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold">{timeLeft.minutes}</span>
                        <p className="text-sm">Min</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold">{timeLeft.seconds}</span>
                        <p className="text-sm">Seg</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Términos y condiciones:</p>
                  <p className="text-sm text-gray-600">
                    {selectedPromotion.terms_conditions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionSection;