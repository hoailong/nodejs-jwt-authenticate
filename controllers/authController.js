const jwtHelper =  require('../helpers/jwt.helper');
const debug = console.log.bind(console);
require('dotenv').config();

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_LIFE;

let login =  async (req, res) => {
    try {
        // Mình sẽ comment mô tả lại một số bước khi làm thực tế cho các bạn như sau nhé:
        // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
        // - Nếu chưa tồn tại thì reject: User not found.
        // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
        // - Nếu password sai thì reject: Password is incorrect.
        // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.
        // Trong ví dụ demo này mình sẽ coi như tất cả các bước xác thực ở trên đều ok, mình chỉ xử lý phần JWT trở về sau thôi nhé:
        debug(`Thực hiện fake thông tin user...`);
        const userFakeData = {
            id: "1234567",
            name: "Phan Van Hoai",
            email: "Hoailong129@gmail.com"
        };
        debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
        const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
        debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
        const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenLife, refreshTokenSecret);
        // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
        // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
        tokenList[refreshToken] = {accessToken, refreshToken};
        return res.status(200).json({accessToken, refreshToken})
    } catch (e) {
        return res.status(500).json(e);
    }
};

let refreshToken = async (req, res)=>{
    const refreshTokenFromClient = req.body.refreshToken;
    if(refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
        try{
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            const userFakeData = decoded.data;

            debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
            return res.status(200).json({accessToken});
        } catch (e) {
            debug(e);
            res.status(403).json({
                message: 'Invalid refresh token'
            });
        }
    }
};

module.exports = {
    login,
    refreshToken
}
