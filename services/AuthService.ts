
import { User, UserRole } from '../types';
import { ROLE_DEFINITIONS } from '../constants';
import { StorageService } from './storage';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
  /**
   * 登录逻辑
   */
  login: async (identifier: string, role?: UserRole): Promise<User> => {
    await delay(600);
    
    // 1. 在“数据库”中查找用户 (支持邮箱或手机号)
    const users = StorageService.getUsers();
    
    // 简单模拟：实际后端会校验密码 hash
    let user = users.find((u: any) => 
      u.email === identifier || 
      u.phone === identifier ||
      u.name === identifier
    );

    // 如果没找到，但在演示模式下，我们会自动创建一个临时的基于角色的用户
    if (!user && role) {
      user = AuthService.createMockUser(role, identifier.split('@')[0]);
    }

    if (!user) {
      throw new Error('用户不存在或密码错误');
    }

    // 更新 Session
    StorageService.setSession(user);
    return user;
  },

  /**
   * 发送验证码 (Mock)
   */
  sendSmsCode: async (phone: string): Promise<string> => {
    await delay(500);
    // 简单校验手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error('手机号格式不正确');
    }
    const code = '123456'; // 演示用固定验证码
    console.log(`[Mock SMS] Sent code ${code} to ${phone}`);
    return code;
  },

  /**
   * 注册逻辑 (支持邮箱或手机)
   */
  register: async (username: string, contact: string, contactType: 'email' | 'phone', role: UserRole = 'creator'): Promise<User> => {
    await delay(800);

    const users = StorageService.getUsers();
    
    if (contactType === 'email') {
      if (users.find((u: any) => u.email === contact)) {
        throw new Error('该邮箱已被注册');
      }
    } else {
      if (users.find((u: any) => u.phone === contact)) {
        throw new Error('该手机号已被注册');
      }
    }

    const roleDef = ROLE_DEFINITIONS.find(r => r.code === role);
    
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`,
      role: role,
      roleName: roleDef?.name || '用户',
      permissions: roleDef?.defaultPermissions || [],
      isAuthenticated: true,
      [contactType]: contact // Dynamically set email or phone
    };

    // 保存到“数据库”
    StorageService.addUser(newUser);
    
    // 自动登录
    StorageService.setSession(newUser);
    
    return newUser;
  },

  /**
   * 获取当前会话
   */
  getCurrentUser: async (): Promise<User | null> => {
    // 模拟 token 校验延迟
    await delay(200);
    return StorageService.getSession();
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    await delay(300);
    StorageService.clearSession();
  },

  /**
   * 辅助方法：生成 Mock 用户（用于快速演示）
   */
  createMockUser: (roleCode: UserRole, nameBase: string): User => {
    const roleDef = ROLE_DEFINITIONS.find(r => r.code === roleCode);
    return {
      id: `u_${Math.floor(Math.random() * 10000)}`,
      name: nameBase || (roleCode === 'creator' ? 'ArtMaster' : 'TechCorp'),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameBase || roleCode)}&background=random&color=fff`,
      role: roleCode,
      roleName: roleDef?.name || '',
      permissions: roleDef?.defaultPermissions || [],
      isAuthenticated: true,
      email: `${nameBase}@demo.com`
    };
  }
};
