import { useState } from 'react';
import { ChevronRight, Sparkles, Compass } from 'lucide-react';

const FOOD_TYPES = ['火锅', '川菜', '粤菜', '日料', '韩料', '西餐', '烧烤', '海鲜', '甜品', '小吃', '面食', '早茶', '素食', '东南亚菜'];
const SCENES = ['朋友聚餐', '约会打卡', '独自探店', '商务宴请', '深夜食堂', '随便吃吃'];
const BUDGETS = ['人均 50 以下', '50-100', '100-200', '200 以上', '不计预算'];
const STYLES = ['网红新店', '老字号', '隐藏小店', '环境优雅', '烟火气'];

export interface Preferences {
  city: string;
  foodTypes: string[];
  scene: string;
  budget: string;
  styles: string[];
}

interface Props {
  onSubmit: (prefs: Preferences) => void;
  loading: boolean;
}

export default function PreferencePanel({ onSubmit, loading }: Props) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('深圳');
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [scene, setScene] = useState('朋友聚餐');
  const [budget, setBudget] = useState('100-200');
  const [styles, setStyles] = useState<string[]>([]);

  const toggleArray = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const canNext = () => {
    if (step === 0) return city.trim().length > 0;
    if (step === 1) return foodTypes.length > 0;
    return true;
  };

  const handleSubmit = () => {
    if (foodTypes.length === 0) return;
    onSubmit({ city: city.trim(), foodTypes, scene, budget, styles });
  };

  const steps = ['城市', '口味', '场景', '预算', '风格'];

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <button
              onClick={() => i <= step && setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                i === step
                  ? 'bg-food-500 text-white shadow-sm'
                  : i < step
                  ? 'bg-food-100 text-food-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s}
            </button>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {/* Step 0: City */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">你想探索哪个城市？</h3>
            <div className="flex flex-wrap gap-3">
              {['深圳', '广州', '上海', '北京', '成都', '杭州', '重庆', '西安'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                    city === c
                      ? 'bg-food-500 text-white shadow-md shadow-food-500/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-food-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-food-400 focus:outline-none focus:ring-2 focus:ring-food-100"
                placeholder="或输入其他城市..."
              />
            </div>
          </div>
        )}

        {/* Step 1: Food Types */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">你想吃什么？（多选）</h3>
            <p className="text-xs text-slate-400">至少选一个，选得越多推荐越精准</p>
            <div className="flex flex-wrap gap-2.5">
              {FOOD_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFoodTypes(toggleArray(foodTypes, t))}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    foodTypes.includes(t)
                      ? 'bg-food-500 text-white shadow-md shadow-food-500/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-food-300 hover:bg-food-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {foodTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 rounded-lg bg-food-50 p-3">
                <span className="text-xs text-food-600">已选：</span>
                {foodTypes.map((t) => (
                  <span key={t} className="rounded-full bg-food-500 px-2 py-0.5 text-xs text-white">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Scene */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">是什么场合？</h3>
            <div className="grid grid-cols-3 gap-3">
              {SCENES.map((s) => (
                <button
                  key={s}
                  onClick={() => setScene(s)}
                  className={`rounded-xl px-3 py-4 text-sm font-medium transition-all ${
                    scene === s
                      ? 'bg-food-500 text-white shadow-md shadow-food-500/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-food-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">预算范围？</h3>
            <div className="flex flex-wrap gap-3">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                    budget === b
                      ? 'bg-food-500 text-white shadow-md shadow-food-500/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-food-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Style */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">喜欢什么风格？（多选）</h3>
            <p className="text-xs text-slate-400">可选填，帮助找到更对味的店</p>
            <div className="flex flex-wrap gap-2.5">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyles(toggleArray(styles, s))}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    styles.includes(s)
                      ? 'bg-trek-green text-white shadow-md shadow-trek-green/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-trek-green/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="text-sm text-slate-400 hover:text-slate-600 disabled:opacity-0"
          >
            ← 上一步
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="btn-primary min-w-[120px]"
            >
              下一步
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || foodTypes.length === 0}
              className="btn-primary min-w-[160px] gap-2 text-base"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI 寻味中
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  开始寻味
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
