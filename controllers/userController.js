const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Varsayılan olarak rol "user"
    const userRole = role || 'user';

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Hashlenmiş şifreyi kaydet
      role: userRole,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      // Rol bilgisine göre yönlendirme yapılacak sayfayı belirleyin
      const redirectTo = user.role === 'admin' ? '/admin-panel' : '/home';
  
      res.status(200).json({
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
        redirectTo, // Bu frontend tarafından kullanılacak
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
};
  

module.exports = { registerUser, loginUser };
