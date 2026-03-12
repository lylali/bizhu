import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Character } from '@shared';
import {
  CharacterList,
  CharacterDrawer,
  CharacterGraph,
  CharacterRelationModal,
  useCharacter,
  CharacterFormData,
} from '@/components/Character';
import { useCharacterStore } from '@/stores/characterStore';

type ViewMode = 'list' | 'graph';

export default function CharacterPage(): JSX.Element {
  const { workId } = useParams<{ workId: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [relationModalOpen, setRelationModalOpen] = useState(false);

  const {
    characters,
    relations,
    isLoading,
    isSaving,
    error,
    loadCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    deleteRelation,
  } = useCharacter(workId || '');

  const { setCharacters, setRelations } = useCharacterStore();

  // 自定义加载函数，同时更新store
  const loadCharactersWithStore = async () => {
    await loadCharacters();
    // 加载完成后更新全局store
    setCharacters(characters);
    setRelations(relations);
  };

  // 初始化加载
  useEffect(() => {
    if (workId) {
      loadCharactersWithStore();
    }
  }, [workId]); // 移除 loadCharacters 依赖，避免无限循环

  // 当characters或relations更新时，同步到store
  useEffect(() => {
    setCharacters(characters);
    setRelations(relations);
  }, [characters, relations, setCharacters, setRelations]);

  // 打开创建角色的抽屉
  const handleCreateClick = () => {
    setSelectedCharacter(undefined);
    setDrawerOpen(true);
  };

  // 打开编辑角色的抽屉
  const handleCardClick = (character: Character) => {
    setSelectedCharacter(character);
    setDrawerOpen(true);
  };

  // 关闭抽屉
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCharacter(undefined);
  };

  // 删除角色
  const handleCardDelete = async (characterId: string) => {
    await deleteCharacter(characterId);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: CharacterFormData) => {
    if (selectedCharacter) {
      return await updateCharacter(selectedCharacter.id, data);
    } else {
      return await createCharacter(data);
    }
  };

  // 切换视图模式
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 打开添加关系弹窗
  const handleAddRelation = () => {
    setRelationModalOpen(true);
  };

  // 关系创建成功回调
  const handleRelationCreated = () => {
    loadCharacters();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">角色卡管理</h1>
          <p className="text-gray-600 mt-1">
            已创建 {characters.length} 个角色，{relations.length} 个关系
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 视图切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              列表视图
            </button>
            <button
              onClick={() => handleViewModeChange('graph')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'graph'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              关系图视图
            </button>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <span>➕</span>
            新建角色
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 内容区域 */}
      {viewMode === 'list' ? (
        /* 角色列表视图 */
        <CharacterList
          characters={characters}
          isLoading={isLoading}
          onCardClick={handleCardClick}
          onCardDelete={handleCardDelete}
          onCreateClick={handleCreateClick}
        />
      ) : (
        /* 关系图视图 */
        <CharacterGraph
          characters={characters}
          relations={relations}
          workId={workId || ''}
          onNodeClick={handleCardClick}
          onAddRelation={handleAddRelation}
          onRefresh={loadCharacters}
        />
      )}

      {/* 右侧抽屉 */}
      <CharacterDrawer
        isOpen={drawerOpen}
        character={selectedCharacter}
        isSaving={isSaving}
        onSubmit={handleFormSubmit}
        onClose={handleDrawerClose}
      />

      {/* 添加关系弹窗 */}
      <CharacterRelationModal
        isOpen={relationModalOpen}
        characters={characters}
        workId={workId || ''}
        onClose={() => setRelationModalOpen(false)}
        onSuccess={handleRelationCreated}
      />
    </div>
  );
}



