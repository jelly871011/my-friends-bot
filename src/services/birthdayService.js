import Friend from "../modules/Friend.js";
import { getFriends } from "./friendService.js";

export const getBirthdayFriendsToday = async () => {
        const today = new Date();
        const month = today.getMonth() + 1; // 0-11 → 1-12
        const day = today.getDate();
        
        return await Friend.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$birthday" }, month] },
                    { $eq: [{ $dayOfMonth: "$birthday" }, day] }
                ]
            }
        });
};

export const getBirthdayCountdown = async () => {
        const friends = await getFriends();

        if (!friends?.length) return [];
        
        const today = new Date();
        const currentYear = today.getFullYear();
        
        const upcomingBirthdays = friends
            .map(friend => {
                if (!friend.birthday) return null;
                
                const birthday = new Date(friend.birthday);
                let nextBirthday = new Date(
                    currentYear,
                    birthday.getMonth(),
                    birthday.getDate()
                );
                
                // 如果今年生日已過，計算明年的生日
                if (nextBirthday < today) {
                    nextBirthday.setFullYear(currentYear + 1);
                }

                // 計算天數差
                const diffTime = nextBirthday - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return {
                    name: friend.name,
                    daysUntil: diffDays,
                    birthday: friend.birthday,
                    nextBirthday: `${nextBirthday.getFullYear()}年${nextBirthday.getMonth() + 1}月${nextBirthday.getDate()}日`
                };
            })
            .filter(Boolean) // 過濾掉無效的生日記錄
            .sort((a, b) => a.daysUntil - b.daysUntil); // 按天數升序排序

        return upcomingBirthdays;
};