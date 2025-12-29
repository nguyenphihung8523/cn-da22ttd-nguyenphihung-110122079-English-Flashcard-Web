import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background Gradient - Tông màu chuyên nghiệp như trang web thật */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/90"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content - Lệch phải */}
            <div className="text-left space-y-6 pl-12 lg:pl-24">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <div className="mb-2">
                    <span className="text-white drop-shadow-lg whitespace-nowrap">Học Tiếng Anh Hiệu Quả</span>
                  </div>
                  <div>
                    <span className="text-white drop-shadow-lg">Với </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-lg">
                      Flashcard
                    </span>
                  </div>
                </h1>
                
                <p className="text-base text-white/90 max-w-sm leading-relaxed">
                  Khám phá phương pháp học tiếng Anh thông minh với flashcard tương tác, 
                  giúp bạn ghi nhớ từ vựng nhanh chóng và hiệu quả.
                </p>
              </div>

              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                >
                  Đăng nhập ngay
                </Link>
                
                <p className="text-white/80 text-sm">
                  Chưa có tài khoản? 
                  <Link to="/register" className="text-blue-300 font-semibold ml-2 hover:text-blue-200 hover:underline transition-colors">
                    Đăng ký miễn phí
                  </Link>
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-4 mt-8">
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Học thông minh</h3>
                    <p className="text-white/80 text-sm">AI cá nhân hóa</p>
                  </div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Tiến bộ nhanh</h3>
                    <p className="text-white/80 text-sm">Kết quả rõ rệt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sample Flashcards */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Flashcard Stack giống LearnCards */}
                <div className="relative">
                  {/* Card 1 - Back card */}
                  <div 
                    className="absolute w-64 h-80 rounded-2xl shadow-lg transform rotate-6 translate-x-4 translate-y-4 bg-white border-4 border-purple-200 opacity-60"
                    style={{ zIndex: 10 }}
                  >
                    <div className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs mb-4">3</div>
                      <div className="text-6xl mb-4">🐱</div>
                      <h3 className="text-3xl font-bold text-purple-600 mb-2">Cat</h3>
                      <p className="text-lg text-gray-600">/kæt/</p>
                    </div>
                  </div>

                  {/* Card 2 - Middle card */}
                  <div 
                    className="absolute w-64 h-80 rounded-2xl shadow-xl transform rotate-3 translate-x-2 translate-y-2 bg-white border-4 border-blue-200 opacity-80"
                    style={{ zIndex: 20 }}
                  >
                    <div className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs mb-4">2</div>
                      <div className="text-6xl mb-4">🌟</div>
                      <h3 className="text-3xl font-bold text-blue-600 mb-2">Star</h3>
                      <p className="text-lg text-gray-600">/stɑːr/</p>
                    </div>
                  </div>

                  {/* Card 3 - Front card */}
                  <div 
                    className="relative w-64 h-80 rounded-2xl shadow-2xl bg-white border-4 border-orange-200"
                    style={{ zIndex: 30 }}
                  >
                    <div className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
                      <div className="flex justify-between items-start w-full mb-4">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">1</div>
                        <div className="text-lg">⭐</div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="text-7xl mb-6">🌞</div>
                        <h3 className="text-4xl font-bold text-orange-600 mb-3">Sun</h3>
                        <p className="text-xl text-gray-600">/sʌn/</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-16 bg-gradient-to-b from-white to-gray-50">
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100/50 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-3">
              Tại sao chọn <span className="text-blue-600">Flashcard</span>?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Khám phá những tính năng độc đáo giúp bạn học tiếng Anh hiệu quả và thú vị hơn bao giờ hết
            </p>
          </div>

          <div className="space-y-16">
            {/* Feature 1 - Nội dung bên trái */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-0 mr-auto max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">📚</span>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Học từ vựng thông minh</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Flashcard AI giúp bạn ghi nhớ từ vựng nhanh chóng với thuật toán lặp lại thông minh. 
                      Kết hợp hình ảnh, âm thanh và ví dụ thực tế để tăng hiệu quả học tập.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">AI cá nhân hóa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Đa phương tiện</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Nội dung bên phải */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-auto mr-0 max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Luyện phát âm chuẩn xác</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Công nghệ nhận diện giọng nói AI giúp bạn luyện phát âm, nhận phản hồi tức thì 
                      và cải thiện kỹ năng nói một cách tự nhiên và tự tin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Nhận diện giọng nói</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Phản hồi tức thì</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">🎤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Nội dung bên trái */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-0 mr-auto max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">📊</span>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Theo dõi tiến độ chi tiết</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Xem thống kê học tập chi tiết, đặt mục tiêu cá nhân và theo dõi tiến bộ hàng ngày. 
                      Hệ thống gamification giúp bạn duy trì động lực học tập.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Thống kê chi tiết</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Gamification</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="relative z-10 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-3">
              Tính năng <span className="text-purple-600">nổi bật</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Khám phá thêm những công cụ học tập hiện đại giúp bạn chinh phục tiếng Anh một cách toàn diện
            </p>
          </div>

          <div className="space-y-16">
            {/* Feature 4 - Nội dung bên phải */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-auto mr-0 max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Hệ thống Quiz thông minh</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Kiểm tra kiến thức với các bài quiz đa dạng, từ trắc nghiệm đến điền từ. 
                      Hệ thống tự động điều chỉnh độ khó dựa trên năng lực của bạn.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Đa dạng câu hỏi</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Tự động điều chỉnh</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">🧠</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5 - Nội dung bên trái */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-0 mr-auto max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">🎯</span>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Hệ thống cấp độ chi tiết</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Học từ cơ bản đến nâng cao với 5 cấp độ: Basic, Intermediate, Advanced, Communication, và Specialized. 
                      Mỗi cấp độ được thiết kế phù hợp với trình độ và mục tiêu học tập.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">5 cấp độ</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Phù hợp mọi trình độ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 6 - Nội dung bên phải */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ml-auto mr-0 max-w-4xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Theo dõi lỗi sai thông minh</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      Hệ thống tự động ghi nhận và phân tích những từ vựng bạn thường mắc lỗi. 
                      Tạo bài học riêng để ôn tập và khắc phục điểm yếu một cách hiệu quả.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Phân tích lỗi sai</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Bài học cá nhân hóa</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="w-48 h-48 bg-gradient-to-br from-red-100 to-pink-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-6xl">🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative z-10 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-3">
              Con số <span className="text-blue-600">ấn tượng</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hàng nghìn học viên đã tin tưởng và đạt được kết quả tuyệt vời với phương pháp học của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">👥</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-2">5,000+</h3>
              <p className="text-slate-600">Học viên tích cực</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">📚</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-2">10,000+</h3>
              <p className="text-slate-600">Flashcard chất lượng</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">⭐</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-2">4.8/5</h3>
              <p className="text-slate-600">Đánh giá trung bình</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">🏆</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-2">95%</h3>
              <p className="text-slate-600">Tỷ lệ thành công</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Bắt đầu hành trình học tiếng Anh ngay hôm nay!
          </h2>
          <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
            Tham gia cùng hàng nghìn học viên đã cải thiện tiếng Anh với phương pháp flashcard thông minh
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Đăng ký miễn phí
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
