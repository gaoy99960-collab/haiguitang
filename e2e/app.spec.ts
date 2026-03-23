import { test, expect } from '@playwright/test';

test.describe('首页 - 游戏大厅', () => {
  test('应显示标题和所有故事卡片', async ({ page }) => {
    await page.goto('/');
    // 标题
    await expect(page.locator('h1')).toContainText('AI');
    await expect(page.locator('h1')).toContainText('海龟汤');
    // 应有6张故事卡片
    const cards = page.locator('main button');
    await expect(cards).toHaveCount(6);
  });

  test('难度筛选应正常工作', async ({ page }) => {
    await page.goto('/');
    // 点击"简单"筛选
    await page.getByRole('button', { name: '简单', exact: true }).click();
    const cards = page.locator('main button');
    await expect(cards).toHaveCount(2); // story-001, story-002

    // 点击"困难"筛选
    await page.getByRole('button', { name: '困难', exact: true }).click();
    await expect(cards).toHaveCount(2); // story-005, story-006

    // 点击"全部"恢复
    await page.getByRole('button', { name: '全部', exact: true }).click();
    await expect(cards).toHaveCount(6);
  });

  test('点击卡片应跳转到游戏页面', async ({ page }) => {
    await page.goto('/');
    // 点击第一张卡片 "海边的汤"
    await page.locator('main button').first().click();
    await expect(page).toHaveURL(/\/game\/story-001/);
  });
});

test.describe('游戏页面', () => {
  test('应显示故事标题和汤面', async ({ page }) => {
    await page.goto('/game/story-001');
    // 标题
    await expect(page.locator('h2')).toContainText('海边的汤');
    // 汤面内容
    await expect(page.locator('text=一个男人走进一家海边餐厅')).toBeVisible();
  });

  test('提示文案应在无消息时显示', async ({ page }) => {
    await page.goto('/game/story-001');
    await expect(page.locator('text=开始向 AI 主持人提问吧')).toBeVisible();
  });

  test('输入框应可输入文字', async ({ page }) => {
    await page.goto('/game/story-001');
    const textarea = page.locator('textarea');
    await textarea.fill('这个男人是自杀吗？');
    await expect(textarea).toHaveValue('这个男人是自杀吗？');
  });

  test('汤面可折叠和展开', async ({ page }) => {
    await page.goto('/game/story-001');
    const surfaceContent = page.locator('text=一个男人走进一家海边餐厅');
    await expect(surfaceContent).toBeVisible();

    // 折叠
    await page.getByRole('button', { name: '汤面' }).click();
    await expect(surfaceContent).not.toBeVisible();

    // 展开
    await page.getByRole('button', { name: '汤面' }).click();
    await expect(surfaceContent).toBeVisible();
  });

  test('查看汤底确认弹窗应正常工作', async ({ page }) => {
    await page.goto('/game/story-001');
    // 点击查看汤底
    await page.getByRole('button', { name: '查看汤底' }).click();
    // 确认弹窗
    await expect(page.locator('text=确定查看汤底？')).toBeVisible();
    // 取消
    await page.getByRole('button', { name: '取消' }).click();
    await expect(page.locator('text=确定查看汤底？')).not.toBeVisible();
  });

  test('退出确认弹窗应可返回大厅', async ({ page }) => {
    await page.goto('/game/story-001');
    // 点击返回按钮 (ArrowLeft)
    await page.locator('header button').first().click();
    await expect(page.locator('text=确定结束游戏？')).toBeVisible();
    // 确认退出
    await page.getByRole('button', { name: '确定' }).click();
    await expect(page).toHaveURL('/');
  });

  test('无效故事ID应重定向到首页', async ({ page }) => {
    await page.goto('/game/invalid-id');
    await expect(page).toHaveURL('/');
  });
});

test.describe('结果页面', () => {
  test('无state时应重定向到首页', async ({ page }) => {
    await page.goto('/result');
    await expect(page).toHaveURL('/');
  });
});
