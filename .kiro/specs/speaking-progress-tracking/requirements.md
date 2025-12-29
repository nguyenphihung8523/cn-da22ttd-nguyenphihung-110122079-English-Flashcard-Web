# Requirements Document

## Introduction

Tính năng theo dõi tiến độ luyện nói cho phép người dùng ghi nhận kết quả luyện tập, theo dõi tiến bộ và nhận gợi ý cá nhân hóa để cải thiện kỹ năng phát âm tiếng Anh.

## Glossary

- **Speaking_Session**: Phiên luyện nói của người dùng với một chủ đề cụ thể
- **Practice_Result**: Kết quả của một lần thực hành phát âm
- **Progress_Tracker**: Hệ thống theo dõi tiến độ học tập
- **Recommendation_Engine**: Công cụ đưa ra gợi ý cá nhân hóa
- **Completion_Status**: Trạng thái hoàn thành của bài luyện

## Requirements

### Requirement 1: Ghi nhận kết quả luyện tập

**User Story:** Là người học, tôi muốn hệ thống ghi nhận kết quả luyện nói của tôi, để tôi có thể theo dõi tiến bộ và xem lại các lần luyện tập trước đó.

#### Acceptance Criteria

1. WHEN người dùng hoàn thành một lần phát âm, THE Practice_Result SHALL lưu trữ điểm chính xác, điểm phát âm và văn bản đã nói
2. WHEN người dùng luyện tập, THE Speaking_Session SHALL ghi nhận số lần luyện cho mỗi bài
3. WHEN người dùng hoàn thành tất cả bài trong một chủ đề, THE Completion_Status SHALL đánh dấu chủ đề đã hoàn thành
4. WHEN kết quả được lưu, THE System SHALL liên kết kết quả với user ID và timestamp
5. THE System SHALL lưu trữ lịch sử tất cả các lần luyện tập của người dùng

### Requirement 2: Theo dõi tiến độ luyện nói

**User Story:** Là người học, tôi muốn xem thống kê tiến độ luyện nói của mình, để tôi có thể đánh giá sự cải thiện và động lực học tập.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL hiển thị tổng số bài đã luyện theo từng cấp độ
2. THE Progress_Tracker SHALL hiển thị tổng số phiên luyện tập đã hoàn thành
3. WHEN người dùng xem thống kê, THE System SHALL hiển thị biểu đồ tiến bộ theo thời gian
4. THE System SHALL tính toán và hiển thị điểm trung bình theo từng tuần/tháng
5. THE Progress_Tracker SHALL hiển thị streak (chuỗi ngày luyện tập liên tiếp)
6. WHEN có dữ liệu đủ, THE System SHALL hiển thị xu hướng cải thiện (tăng/giảm/ổn định)

### Requirement 3: Cá nhân hóa luyện nói

**User Story:** Là người học, tôi muốn nhận được gợi ý cá nhân hóa dựa trên kết quả luyện tập, để tôi có thể tập trung vào những điểm cần cải thiện.

#### Acceptance Criteria

1. WHEN người dùng có lỗi phát âm thường xuyên, THE Recommendation_Engine SHALL gợi ý các bài luyện tập liên quan
2. THE Recommendation_Engine SHALL phân tích điểm số và gợi ý cấp độ phù hợp tiếp theo
3. WHEN người dùng hoàn thành một cấp độ với điểm cao, THE System SHALL gợi ý chuyển lên cấp độ cao hơn
4. THE Recommendation_Engine SHALL gợi ý ôn tập các chủ đề có điểm thấp
5. WHEN người dùng không luyện tập trong thời gian dài, THE System SHALL gửi nhắc nhở và gợi ý bài luyện phù hợp
6. THE System SHALL cá nhân hóa nội dung dựa trên lịch sử luyện tập và sở thích của người dùng

### Requirement 4: Báo cáo và phân tích

**User Story:** Là người học, tôi muốn xem báo cáo chi tiết về kết quả luyện nói, để tôi có thể hiểu rõ điểm mạnh và điểm yếu của mình.

#### Acceptance Criteria

1. THE System SHALL tạo báo cáo hàng tuần về tiến độ luyện nói
2. THE System SHALL hiển thị phân tích chi tiết về các từ/cụm từ hay mắc lỗi
3. WHEN người dùng xem báo cáo, THE System SHALL hiển thị so sánh với kỳ trước
4. THE System SHALL cung cấp insights về thời gian luyện tập hiệu quả nhất
5. THE System SHALL hiển thị thống kê theo từng kỹ năng (phát âm, độ chính xác, tốc độ nói)

### Requirement 5: Gamification và động lực

**User Story:** Là người học, tôi muốn có các yếu tố game hóa trong quá trình luyện nói, để tôi có động lực học tập lâu dài.

#### Acceptance Criteria

1. THE System SHALL trao huy hiệu khi người dùng đạt các mốc quan trọng
2. THE System SHALL tính điểm tích lũy dựa trên kết quả luyện tập
3. WHEN người dùng luyện tập đều đặn, THE System SHALL tăng streak counter
4. THE System SHALL có bảng xếp hạng cá nhân theo thời gian
5. THE System SHALL đặt mục tiêu hàng ngày/tuần và theo dõi tiến độ hoàn thành